from dataclasses import dataclass
from typing import Tuple

import pytest
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


# @pytest.mark.asyncio
# async def test_register_doctor_by_owner(contract_factory):
#     """Owner should be able to register doctor address to a given id"""
#     _, owner_account, doctor_account, _, contract = contract_factory

#     await owner_account.signer.send_transaction(
#         account=owner_account.contract,
#         to=contract.contract_address,
#         selector_name="register_doctor",
#         calldata=[some_doctor_id, doctor_account.contract.contract_address],
#     )

#     # Check the owner is registered
#     observed_doctor = await contract.get_doctor_id(address=doctor_account.contract.contract_address).call()
#     assert observed_doctor.result == (some_doctor_id,)

# @pytest.mark.asyncio
# async def test_register_doctor_by_nurse(contract_factory):
#     """Non-Owner should not be able to register doctor address to a given id"""
#     _, _, doctor_account, nurse_account, contract = contract_factory

#     with pytest.raises(StarkException):
#         await nurse_account.signer.send_transaction(
#             account=nurse_account.contract,
#             to=contract.contract_address,
#             selector_name="register_doctor",
#             calldata=[some_doctor_id, doctor_account.contract.contract_address],
#         )

#     # Check the owner is registered
#     observed_doctor = await contract.get_doctor_id(address=doctor_account.contract.contract_address).call()
#     assert observed_doctor.result == (some_doctor_id,)

# @pytest.mark.asyncio
# async def test_register_nurse_by_owner(contract_factory):
#     """Owner should be able to register nurse address to a given id"""
#     _, owner_account, _, nurse_account, contract = contract_factory

#     await owner_account.signer.send_transaction(
#         account=owner_account.contract,
#         to=contract.contract_address,
#         selector_name="register_nurse",
#         calldata=[some_nurse_id, nurse_account.contract.contract_address],
#     )

#     # Check the owner is registered
#     observed_nurse = await contract.get_nurse_id(address=nurse_account.contract.contract_address).call()
#     assert observed_nurse.result == (some_nurse_id,)

# @pytest.mark.asyncio
# async def test_register_nurse_by_doctor(contract_factory):
#     """Non-Owner should not be able to register nurse address to a given id"""
#     _, _, doctor_account, nurse_account, contract = contract_factory

#     with pytest.raises(StarkException):
#         await doctor_account.signer.send_transaction(
#             account=doctor_account.contract,
#             to=contract.contract_address,
#             selector_name="register_nurse",
#             calldata=[some_nurse_id, nurse_account.contract.contract_address],
#         )

#     # Check the owner is registered
#     observed_nurse = await contract.get_nurse_id(address=nurse_account.contract.contract_address).call()
#     assert observed_nurse.result == (some_nurse_id,)


# @pytest.mark.asyncio
# async def test_attest_prescription_log(contract_factory):
#     """Doctor Should successfully attest to a prescription log"""
#     _, owner_account, doctor_account, _, contract = contract_factory

#     await owner_account.signer.send_transaction(
#         account=owner_account.contract,
#         to=contract.contract_address,
#         selector_name="register_doctor",
#         calldata=[some_doctor_id, doctor_account.contract.contract_address],
#     )

#     prescription_id = 1
#     log_hash = 1234
#     observed_log = await contract.get_prescription_log(
#         prescription_id=prescription_id
#     ).call()
#     print("observed_log AHHHHH")
#     print(observed_log)
#     await doctor_account.signer.send_transaction(
#         account=doctor_account.contract,
#         to=contract.contract_address,
#         selector_name="attest_prescription_log",
#         calldata=[prescription_id, log_hash],
#     )

#     # Check the state hash was committed
#     observed_log = await contract.get_prescription_log(
#         prescription_id=prescription_id
#     ).call()
#     assert observed_log.result == (log_hash,)

# @pytest.mark.asyncio
# async def test_attest_prescription_log_with_duplicate_id(contract_factory):
#     """Should fail with a duplicate prescription id"""
#     _, owner_account, doctor_account, _, contract = contract_factory

#     await owner_account.signer.send_transaction(
#         account=owner_account.contract,
#         to=contract.contract_address,
#         selector_name="register_doctor",
#         calldata=[some_doctor_id, doctor_account.contract.contract_address],
#     )

#     prescription_id = 1
#     log_hash = 1234

#     with pytest.raises(StarkException):
#         await doctor_account.signer.send_transaction(
#             account=doctor_account.contract,
#             to=contract.contract_address,
#             selector_name="attest_prescription_log",
#             calldata=[prescription_id, log_hash],
#         )


# @pytest.mark.asyncio
# async def test_attest_prescription_log_with_nurse_account(contract_factory):
#     """Should fail when attesting prescription log from nurse instead of doctor"""
#     _, _, _, nurse_account, contract = contract_factory

#     prescription_id = 2
#     log_hash = 1234
#     with pytest.raises(StarkException):
#         await nurse_account.signer.send_transaction(
#             account=nurse_account.contract,
#             to=contract.contract_address,
#             selector_name="attest_prescription_log",
#             calldata=[prescription_id, log_hash],
#         )


# @pytest.mark.asyncio
# async def test_attest_prescription_log_no_account(contract_factory):
#     """Should fail to commit prescription log if no account signed the tx"""
#     _, _, _, _, contract = contract_factory

#     with pytest.raises(StarkException):
#         # Transaction not sent through an account
#         await contract.attest_prescription_log(
#             prescription_id=5,
#             log_hash=4567,
#         ).invoke()

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
    log_hash = 1234
    observed_log = await contract.get_prescription_log(
        prescription_id=prescription_id
    ).call()
    print("observed_log AHHHHH")
    print(observed_log)
    await doctor_account.signer.send_transaction(
        account=doctor_account.contract,
        to=contract.contract_address,
        selector_name="attest_prescription_log",
        calldata=[prescription_id, log_hash],
    )

    # Check the state hash was committed
    observed_log = await contract.get_prescription_log(
        prescription_id=prescription_id
    ).call()
    assert observed_log.result == (log_hash,)

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

    prescription_id = 1
    log_hash = 1234

    with pytest.raises(StarkException):
        await doctor_account.signer.send_transaction(
            account=doctor_account.contract,
            to=contract.contract_address,
            selector_name="attest_prescription_log",
            calldata=[prescription_id, log_hash],
        )


@pytest.mark.asyncio
async def test_attest_prescription_log_with_nurse_account(contract_factory):
    """Should fail when attesting prescription log from nurse instead of doctor"""
    _, _, _, nurse_account, contract = contract_factory

    prescription_id = 2
    log_hash = 1234
    with pytest.raises(StarkException):
        await nurse_account.signer.send_transaction(
            account=nurse_account.contract,
            to=contract.contract_address,
            selector_name="attest_prescription_log",
            calldata=[prescription_id, log_hash],
        )


@pytest.mark.asyncio
async def test_attest_prescription_log_no_account(contract_factory):
    """Should fail to commit prescription log if no account signed the tx"""
    _, _, _, _, contract = contract_factory

    with pytest.raises(StarkException):
        # Transaction not sent through an account
        await contract.attest_prescription_log(
            prescription_id=5,
            log_hash=4567,
        ).invoke()


# @pytest.mark.asyncio
# async def test_set_signer_invalid_account(contract_factory):
#     """Should fail to update the signer if the wrong account calls it"""
#     _, _, doctor_account, contract = contract_factory

#     some_new_signer_address = 88888888
#     with pytest.raises(StarkException):
#         # Send transaction with the delegated signer not the owner
#         await doctor_account.signer.send_transaction(
#             account=doctor_account.contract,
#             to=contract.contract_address,
#             selector_name="set_signer",
#             calldata=[some_vehicle, some_new_signer_address],
#         )


# @pytest.mark.asyncio
# async def test_set_signer_no_account(contract_factory):
#     """Should fail to update the signer if no account signed the tx"""
#     _, _, _, contract = contract_factory

#     some_new_signer_address = 88888888
#     with pytest.raises(StarkException):
#         # Transaction not sent through an account
#         await contract.set_signer(
#             vehicle_id=some_vehicle,
#             signer_address=some_new_signer_address,
#         ).invoke()


# @pytest.mark.asyncio
# async def test_set_signer(contract_factory):
#     """Should successfully update the signer for the car"""
#     _, owner_account, _, contract = contract_factory

#     some_new_signer_address = 88888888
#     await owner_account.signer.send_transaction(
#         account=owner_account.contract,
#         to=contract.contract_address,
#         selector_name="set_signer",
#         calldata=[some_vehicle, some_new_signer_address],
#     )

#     # Check that the signer is updated
#     observed_signer = await contract.get_signer(vehicle_id=some_vehicle).call()
#     assert observed_signer.result == (some_new_signer_address,)
