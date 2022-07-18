from dataclasses import dataclass
from typing import Tuple

import pytest
import hashlib
import asyncio
from starkware.starknet.testing.starknet import Starknet, StarknetContract
from starkware.starkware_utils.error_handling import StarkException
from utils import MockSigner


some_doctor_id = 1
some_nurse_id = 1

@dataclass
class Account:
    signer: MockSigner
    contract: StarknetContract


@pytest.fixture(scope="module")
def event_loop():
    return asyncio.new_event_loop()


# Reusable local network & contracts to save testing time
@pytest.fixture(scope="module")
async def contract_factory() -> Tuple[Starknet, Account, Account, StarknetContract]:
    starknet = await Starknet.empty()
    some_signer = MockSigner(private_key=12345)
    owner_account = Account(
        signer=some_signer,
        contract=await starknet.deploy(
            "contracts/Account.cairo", constructor_calldata=[some_signer.public_key]
        ),
    )
    some_other_signer_for_doctor = MockSigner(private_key=123456789)
    doctor_account = Account(
        signer=some_other_signer_for_doctor,
        contract=await starknet.deploy(
            "contracts/Account.cairo",
            constructor_calldata=[some_other_signer_for_doctor.public_key],
        ),
    )
    some_other_signer_for_nurse = MockSigner(private_key=123456789)
    nurse_account = Account(
        signer=some_other_signer_for_nurse,
        contract=await starknet.deploy(
            "contracts/Account.cairo",
            constructor_calldata=[some_other_signer_for_nurse.public_key],
        ),
    )
    contract = await starknet.deploy("contracts/contract.cairo", constructor_calldata=[owner_account.contract.contract_address])
    return starknet, owner_account, doctor_account, nurse_account, contract


@pytest.mark.asyncio
async def test_register_doctor_by_owner(contract_factory):
    """Owner should be able to register doctor address to a given id"""
    _, owner_account, doctor_account, _, contract = contract_factory

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_doctor",
        calldata=[some_doctor_id, doctor_account.contract.contract_address],
    )

    # Check the owner is registered
    observed_doctor = await contract.get_doctor_id(address=doctor_account.contract.contract_address).call()
    assert observed_doctor.result == (some_doctor_id,)

@pytest.mark.asyncio
async def test_register_doctor_by_nurse(contract_factory):
    """Non-Owner should not be able to register doctor address to a given id"""
    _, _, doctor_account, nurse_account, contract = contract_factory

    with pytest.raises(StarkException):
        await nurse_account.signer.send_transaction(
            account=nurse_account.contract,
            to=contract.contract_address,
            selector_name="register_doctor",
            calldata=[some_doctor_id, doctor_account.contract.contract_address],
        )

    # Check the owner is registered
    observed_doctor = await contract.get_doctor_id(address=doctor_account.contract.contract_address).call()
    assert observed_doctor.result == (some_doctor_id,)

@pytest.mark.asyncio
async def test_register_nurse_by_owner(contract_factory):
    """Owner should be able to register nurse address to a given id"""
    _, owner_account, _, nurse_account, contract = contract_factory

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_nurse",
        calldata=[some_nurse_id, nurse_account.contract.contract_address],
    )

    # Check the owner is registered
    observed_nurse = await contract.get_nurse_id(address=nurse_account.contract.contract_address).call()
    assert observed_nurse.result == (some_nurse_id,)

@pytest.mark.asyncio
async def test_register_nurse_by_doctor(contract_factory):
    """Non-Owner should not be able to register nurse address to a given id"""
    _, _, doctor_account, nurse_account, contract = contract_factory

    with pytest.raises(StarkException):
        await doctor_account.signer.send_transaction(
            account=doctor_account.contract,
            to=contract.contract_address,
            selector_name="register_nurse",
            calldata=[some_nurse_id, nurse_account.contract.contract_address],
        )

    # Check the owner is registered
    observed_nurse = await contract.get_nurse_id(address=nurse_account.contract.contract_address).call()
    assert observed_nurse.result == (some_nurse_id,)


@pytest.mark.asyncio
async def test_attest_prescription_log(contract_factory):
    """Doctor Should successfully attest to a prescription log"""
    _, owner_account, doctor_account, _, contract = contract_factory

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_doctor",
        calldata=[some_doctor_id, doctor_account.contract.contract_address],
    )

    prescription_id = 1
    hash_1 = 1234
    hash_2 = 5678

    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_prescription_log",
        calldata=[prescription_id, hash_1, hash_2],
    )

    # Check the state hash was committed
    observed_log = await contract.get_prescription_log(
        prescription_id=prescription_id
    ).call()
    assert observed_log.result == ((hash_1, hash_2),)


@pytest.mark.asyncio
async def test_attest_prescription_log_with_duplicate_id(contract_factory):
    """Should fail with a duplicate prescription id"""
    _, owner_account, doctor_account, _, contract = contract_factory

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_doctor",
        calldata=[some_doctor_id, doctor_account.contract.contract_address],
    )

    prescription_id = 4
    hash_1 = 1234
    hash_2 = 5678

    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_prescription_log",
        calldata=[prescription_id, hash_1, hash_2],
    )

    with pytest.raises(StarkException):
        await doctor_account.signer.send_transaction(
            account=doctor_account.contract,
            to=contract.contract_address,
            selector_name="attest_prescription_log",
            calldata=[prescription_id, hash_1, hash_2],
        )


@pytest.mark.asyncio
async def test_attest_prescription_log_with_nurse_account(contract_factory):
    """Should fail when attesting prescription log from nurse instead of doctor"""
    _, _, _, nurse_account, contract = contract_factory

    prescription_id = 2
    hash_1 = 1234
    hash_2 = 5678
    with pytest.raises(StarkException):
        await nurse_account.signer.send_transaction(
            account=nurse_account.contract,
            to=contract.contract_address,
            selector_name="attest_prescription_log",
            calldata=[prescription_id, hash_1, hash_2],
        )


@pytest.mark.asyncio
async def test_attest_prescription_log_no_account(contract_factory):
    """Should fail to commit prescription log if no account signed the tx"""
    _, _, _, _, contract = contract_factory

    with pytest.raises(StarkException):
        # Transaction not sent through an account
        await contract.attest_prescription_log(
            prescription_id=5,
            hash_1=4567,
            hash_2=8901,
        ).invoke()


@pytest.mark.asyncio
async def test_attest_drug_administration_log_with_unlogged_prescription_id(contract_factory):
    """Should fail if prescription id is not logged before"""
    _, owner_account, doctor_account, _, contract = contract_factory

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_doctor",
        calldata=[some_doctor_id, doctor_account.contract.contract_address],
    )

    prescription_id = 100
    drug_administration_id = 1
    drug_administration_hash_1 = 14567
    drug_administration_hash_2 = 28901

    with pytest.raises(StarkException):
        await doctor_account.signer.send_transaction(
            account=doctor_account.contract,
            to=contract.contract_address,
            selector_name="attest_drug_administration_log",
            calldata=[drug_administration_id, prescription_id, drug_administration_hash_1, drug_administration_hash_2],
        )

@pytest.mark.asyncio
async def test_attest_drug_administration_log_with_duplicate_id(contract_factory):
    """Should fail with a duplicate drug administration id"""
    _, owner_account, doctor_account, _, contract = contract_factory

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_doctor",
        calldata=[some_doctor_id, doctor_account.contract.contract_address],
    )

    prescription_id = 101
    drug_administration_id = 1
    prescription_hash_1 = 1234
    prescription_hash_2 = 5678
    drug_administration_hash_1 = 14567
    drug_administration_hash_2 = 28901

    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_prescription_log",
        calldata=[prescription_id, prescription_hash_1, prescription_hash_2],
    )

    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_drug_administration_log",
        calldata=[drug_administration_id, prescription_id, drug_administration_hash_1, drug_administration_hash_2],
    )

    with pytest.raises(StarkException):
        await doctor_account.signer.send_transaction(
            account=doctor_account.contract,
            to=contract.contract_address,
            selector_name="attest_drug_administration_log",
            calldata=[drug_administration_id, prescription_id, drug_administration_hash_1, drug_administration_hash_2],
        )

@pytest.mark.asyncio
async def test_doctor_attest_drug_administration_log(contract_factory):
    """Doctor Should successfully attest to a drug administrtion log"""
    _, owner_account, doctor_account, _, contract = contract_factory

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_doctor",
        calldata=[some_doctor_id, doctor_account.contract.contract_address],
    )

    prescription_id = 5
    drug_administration_id = 2
    prescription_hash_1 = 1234
    prescription_hash_2 = 5678
    drug_administration_hash_1 = 14567
    drug_administration_hash_2 = 28901

    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_prescription_log",
        calldata=[prescription_id, prescription_hash_1, prescription_hash_2],
    )

    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_drug_administration_log",
        calldata=[drug_administration_id, prescription_id, drug_administration_hash_1, drug_administration_hash_2],
    )

    # Check the state hash was committed
    observed_log = await contract.get_drug_administration_log(
        drug_administration_id=drug_administration_id
    ).call()
    assert observed_log.result == ((prescription_id, drug_administration_hash_1, drug_administration_hash_2),)

@pytest.mark.asyncio
async def test_nurse_attest_drug_administration_log(contract_factory):
    """Nurse Should successfully attest to a drug administrtion log"""
    _, owner_account, doctor_account, nurse_account, contract = contract_factory

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_doctor",
        calldata=[some_doctor_id, doctor_account.contract.contract_address],
    )

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_nurse",
        calldata=[some_nurse_id, nurse_account.contract.contract_address],
    )

    prescription_id = 3
    drug_administration_id = 3
    prescription_hash_1 = 1234
    prescription_hash_2 = 5678
    drug_administration_hash_1 = 14567
    drug_administration_hash_2 = 28901

    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_prescription_log",
        calldata=[prescription_id, prescription_hash_1, prescription_hash_2],
    )

    await nurse_account.signer.send_transaction(
        account=nurse_account.contract,
        to=contract.contract_address,
        selector_name="attest_drug_administration_log",
        calldata=[drug_administration_id, prescription_id, drug_administration_hash_1, drug_administration_hash_2],
    )

    # Check the state hash was committed
    observed_log = await contract.get_drug_administration_log(
        drug_administration_id=drug_administration_id
    ).call()
    assert observed_log.result == ((prescription_id, drug_administration_hash_1, drug_administration_hash_2),)


@pytest.mark.asyncio
async def test_attest_prescription_log_no_account(contract_factory):
    """Should fail to commit drug administation log if no account signed the tx"""
    _, _, _, _, contract = contract_factory

    with pytest.raises(StarkException):
        # Transaction not sent through an account
        await contract.attest_drug_administration_log(
            drug_administration_id=6,
            prescription_id=6,
            hash_1=4567,
            hash_2=8901,
        ).invoke()


@pytest.mark.asyncio
async def test_verify_prescription_log(contract_factory):
    """Should successfully veryify prescription log"""
    _, owner_account, doctor_account, _, contract = contract_factory

    prescription_id = 1
    case_id = 1
    doctor_id = some_doctor_id
    drug_id = 1
    quantity = 1
    unit_id = 1
    frequency = 3
    route_id = 2
    input_list=[prescription_id, case_id, doctor_id, drug_id, quantity, unit_id, frequency, route_id]
    hashes = await contract.compute_sha256(
        input_list,
        32
    ).call()

    await owner_account.signer.send_transaction(
        account=owner_account.contract,
        to=contract.contract_address,
        selector_name="register_doctor",
        calldata=[some_doctor_id, doctor_account.contract.contract_address],
    )

    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_prescription_log",
        calldata=[prescription_id, hashes.result[0], hashes.result[1]],
    )

    # Check the state hash was committed
    result = await contract.verify_prescription_log(
        prescription_id,
        input_list,
        32
    ).call()

    assert result.result == (1,)