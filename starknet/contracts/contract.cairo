%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_not_zero
from starkware.starknet.common.syscalls import get_caller_address

#
# Struct
#

struct DrugAdministrationLog:
    member prescription_id: felt
    member log_hash: felt
end

#
# Storage
#

# Mapping for doctor address
@storage_var
func owner() -> (owner_address : felt):
end

# Mapping for doctor address
@storage_var
func doctor_ids(address : felt) -> (doctor_id : felt):
end

# Mapping for nurse address
@storage_var
func nurse_ids(address : felt) -> (nurse_id : felt):
end

# Hashes of the followings for prescription log at some id
# - case_id
# - doctor_id
# - drug_id
# - quantity
# - unit_id (e.g. pill, ml, etc.)
# - frequency (per day to keep it simple)
# - route_id (e.g. oral, iv, etc.)
@storage_var
func prescription_log(prescription_id : felt) -> (log_hash : felt):
end

# Hashes of prescription_id, case_id, nurse_id, drug_id, quantity, unit_id, route_id for drug administration log at some id
# - prescription_id
# - case_id
# - nurse_id
# - drug_id
# - quantity
# - unit_id (e.g. pill, ml, etc.)
# - route_id (e.g. oral, iv, etc.)
@storage_var
func drug_administration_log(drug_administration_id : felt) -> (log : DrugAdministrationLog):
end

@constructor
func constructor{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}(owner_address : felt):
    owner.write(value=owner_address)
    return ()
end

#
# Getters
#

@view
func get_owner{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}() -> (address : felt):
    let (address) = owner.read()
    return (address)
end

@view
func get_doctor_id{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        address : felt) -> (doctor_id : felt):
    let (doctor_id) = doctor_ids.read(address=address)
    return (doctor_id=doctor_id)
end

@view
func get_nurse_id{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        address : felt) -> (nurse_id : felt):
    let (nurse_id) = nurse_ids.read(address=address)
    return (nurse_id=nurse_id)
end

@view
func get_prescription_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        prescription_id : felt) -> (log_hash : felt):
    let (log_hash) = prescription_log.read(prescription_id=prescription_id)
    return (log_hash=log_hash)
end

@view
func get_drug_administration_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        drug_administration_id : felt) -> (drug_administration_log : DrugAdministrationLog):
    let (log) = drug_administration_log.read(drug_administration_id=drug_administration_id)
    return (drug_administration_log=log)
end

# (https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/cairo/common/keccak.cairo)
# (https://github.com/starkware-libs/cairo-examples/blob/master/sha256/sha256.cairo)
@view
func verify_prescription_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        prescription_id : felt, case_id : felt, doctor_id : felt, drug_id : felt, quantity : felt, unit_id : felt, frequency : felt, route_id : felt) -> (result : felt):
    let (log_hash) = prescription_log.read(prescription_id=prescription_id)
    # TODO : compute SHA256 hash and compare to log_hash
    return (result=1)
end

@view
func verify_drug_administration_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        drug_administration_id : felt, prescription_id : felt, case_id : felt, nurse_id : felt, drug_id : felt, quantity : felt, unit_id : felt, route_id : felt) -> (result : felt):
    let (log) = drug_administration_log.read(drug_administration_id=drug_administration_id)
    # TODO : compute SHA256 hash and compare to log_hash
    return (result=1)
end


#
# Setters
#

# Register doctor by owner
@external
func register_doctor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        doctor_id : felt, address : felt):
    # Verify caller is owner
    onlyOwner()

    # Verify doctor_id & address are non zero
    assert_not_zero(doctor_id)
    assert_not_zero(address)

    # Initialize doctor id
    doctor_ids.write(address=address, value=doctor_id)
    return ()
end

# Register nurse by owner
@external
func register_nurse{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        nurse_id : felt, address : felt):
    # Verify caller is owner
    onlyOwner()

    # Verify nurse_id & address are non zero
    assert_not_zero(nurse_id)
    assert_not_zero(address)

    # Initialize the nurse id
    nurse_ids.write(address=address, value=nurse_id)
    return ()
end

# Doctor can attest to a prescription log hash
@external
func attest_prescription_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        prescription_id : felt, log_hash : felt):
    # Verify caller is a doctor
    onlyDoctor()

    # Make sure a unique prescription id was used
    let (log) = prescription_log.read(prescription_id=prescription_id)
    assert log = 0

    # Register log
    prescription_log.write(prescription_id=prescription_id, value=log_hash)
    return ()
end

# Both doctors and nurses can attest to a drug administration log hash
@external
func attest_drug_administration_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        drug_administration_id : felt, prescription_id : felt, log_hash : felt):
    # Verify caller is a doctor or a nurse
    onlyHealthcareProviders()

    # Make sure the prescription id was recorded
    let (log1) = prescription_log.read(prescription_id=prescription_id)
    assert_not_zero(log1)

    # Make sure a unique drug administration id was used
    let (log) = drug_administration_log.read(drug_administration_id=drug_administration_id)
    assert log = DrugAdministrationLog(prescription_id=0, log_hash=0)

    # Register log
    drug_administration_log.write(
        drug_administration_id=drug_administration_id,
        value=DrugAdministrationLog(
            prescription_id=prescription_id,
            log_hash=log_hash
        )
    )
    return ()
end

# Check if caller is owner
func onlyOwner{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr
}():
    let (caller) = get_caller_address()
    let (owner) = get_owner()
    assert_not_zero(caller)
    assert_not_zero(owner)
    assert caller = owner

    return ()
end

# Check if caller is doctor
func onlyDoctor{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr
}():
    let (caller) = get_caller_address()
    assert_not_zero(caller)

    let (doctor_id) = get_doctor_id(caller)
    assert_not_zero(doctor_id)

    return ()
end

# Check if caller is healthcare providers
func onlyHealthcareProviders{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr
}():
    let (caller) = get_caller_address()
    assert_not_zero(caller)

    let (doctor_id) = get_doctor_id(caller)
    let (nurse_id) = get_nurse_id(caller)
    assert_not_zero(doctor_id + nurse_id)
    
    return ()
end