%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_not_zero
from starkware.starknet.common.syscalls import get_caller_address

#
# Storage
#

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
func prescription_log(prescription_id : felt) -> (log_hash : felt, case_id : felt, frequency : felt):
end

# Hashes of prescription_id, case_id, nurse_id, drug_id, quantity, unit_id, route_id for drug administering log at some id
# - prescription_id
# - case_id
# - nurse_id
# - drug_id
# - quantity
# - unit_id (e.g. pill, ml, etc.)
# - route_id (e.g. oral, iv, etc.)
@storage_var
func drug_administering_log(drug_administering_id : felt) -> (log_hash : felt):
end

#
# Getters
#

@view
func get_doctor_id{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        address : felt) -> (doctor_id : felt):
    let (doctor_id) = doctor_ids.read(address=address)
    return (doctor_id=doctor_id)
end

@view
func get_nurse_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        address : felt) -> (nurse_id : felt):
    let (nurse_id) = nurse_ids.read(address=address)
    return (nurse_id=nurse_id)
end

@view
func get_prescription_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        prescription_id : felt) -> (log_hash : felt):
    let (log_hash, _, _) = prescription_log.read(prescription_id=prescription_id)
    return (log_hash=log_hash)
end

@view
func get_drug_administration_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        drug_administration_id : felt) -> (log_hash : felt):
    let (log_hash) = drug_administering_log.read(drug_administration_id=drug_administration_id)
    return (log_hash=log_hash)
end

# (https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/cairo/common/keccak.cairo)
# (https://github.com/starkware-libs/cairo-examples/blob/master/sha256/sha256.cairo)
@view
func verify_prescription_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        prescription_id : felt, case_id : felt, doctor_id : felt, drug_id : felt, quantity : felt, unit_id : felt, frequency : felt, route_id : felt) -> (result : felt):
    let (log_hash, _, _) = prescription_log.read(prescription_id=prescription_id)
    # TODO : compute SHA256 hash and compare to log_hash
end

@view
func verify_drug_administration_log{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        drug_administering_id : felt, prescription_id : felt, case_id : felt, nurse_id : felt, drug_id : felt, quantity : felt, unit_id : felt, route_id : felt) -> (result : felt):
    let (log_hash) = vehicle_state.read(vehicle_id=vehicle_id, state_id=state_id)
    # TODO : compute SHA256 hash and compare to log_hash
end


#
# Setters
#

# Initializes the vehicle with a given owner & signer
@external
func register_doctor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        vehicle_id : felt, signer_address : felt):
    # Verify that the vehicle ID is available
    let (is_vehicle_id_taken) = vehicle_owner_address.read(vehicle_id=vehicle_id)
    assert is_vehicle_id_taken = 0

    # Caller is the owner. Verify caller & signer are non zero
    let (owner_address) = get_caller_address()
    assert_not_zero(owner_address)
    assert_not_zero(signer_address)

    # Initialize the vehicle's owner and signer
    vehicle_owner_address.write(vehicle_id=vehicle_id, value=owner_address)
    vehicle_signer_address.write(vehicle_id=vehicle_id, value=signer_address)
    return ()
end

# Vehicle signers can attest to a state hash -- data storage & verification off-chain
@external
func attest_state{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        vehicle_id : felt, state_id : felt, state_hash : felt):
    # Verify the vehicle has been registered & the caller is the signer
    let (signer_address) = vehicle_signer_address.read(vehicle_id=vehicle_id)
    let (caller) = get_caller_address()
    assert_not_zero(caller)
    assert signer_address = caller

    # Make sure a unique state id was used
    let (state) = vehicle_state.read(vehicle_id=vehicle_id, state_id=state_id)
    assert state = 0

    # Register state
    vehicle_state.write(vehicle_id=vehicle_id, state_id=state_id, value=state_hash)
    return ()
end

# Vehicle owners can change the signing authority for a car they own
@external
func set_signer{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        vehicle_id : felt, signer_address : felt):
    # Verify the vehicle has been registered & the caller is the owner
    let (owner_address) = vehicle_owner_address.read(vehicle_id=vehicle_id)
    let (caller) = get_caller_address()
    assert_not_zero(caller)
    assert owner_address = caller

    # Update signer
    vehicle_signer_address.write(vehicle_id=vehicle_id, value=signer_address)
    return ()
end
