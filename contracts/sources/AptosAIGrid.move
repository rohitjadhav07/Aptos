module aptosai_grid::ai_grid {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;

    /// Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;
    const E_MODEL_NOT_FOUND: u64 = 4;

    /// AI Model structure
    struct AIModel has key, store, copy, drop {
        id: u64,
        name: String,
        description: String,
        owner: address,
        price_per_inference: u64, // in octas (1 APT = 100,000,000 octas)
        total_inferences: u64,
        created_at: u64,
    }

    /// Global state for the AI Grid
    struct AIGridState has key {
        models: vector<AIModel>,
        next_model_id: u64,
        total_models: u64,
        total_inferences: u64,
    }

    /// Initialize the AI Grid (should be called by the module publisher)
    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<AIGridState>(account_addr), E_ALREADY_INITIALIZED);
        
        move_to(account, AIGridState {
            models: vector::empty<AIModel>(),
            next_model_id: 1,
            total_models: 0,
            total_inferences: 0,
        });
    }

    /// Upload a new AI model to the grid
    public entry fun upload_model(
        account: &signer,
        name: String,
        description: String,
        price_per_inference: u64,
    ) acquires AIGridState {
        let account_addr = signer::address_of(account);
        let grid_addr = @aptosai_grid;
        
        assert!(exists<AIGridState>(grid_addr), E_NOT_INITIALIZED);
        
        let grid_state = borrow_global_mut<AIGridState>(grid_addr);
        
        let new_model = AIModel {
            id: grid_state.next_model_id,
            name,
            description,
            owner: account_addr,
            price_per_inference,
            total_inferences: 0,
            created_at: timestamp::now_seconds(),
        };
        
        vector::push_back(&mut grid_state.models, new_model);
        grid_state.next_model_id = grid_state.next_model_id + 1;
        grid_state.total_models = grid_state.total_models + 1;
    }

    /// Execute an inference on a model (pay for usage)
    public entry fun execute_inference(
        account: &signer,
        model_id: u64,
    ) acquires AIGridState {
        let account_addr = signer::address_of(account);
        let grid_addr = @aptosai_grid;
        
        assert!(exists<AIGridState>(grid_addr), E_NOT_INITIALIZED);
        
        let grid_state = borrow_global_mut<AIGridState>(grid_addr);
        let models_len = vector::length(&grid_state.models);
        let i = 0;
        let model_found = false;
        
        while (i < models_len) {
            let model = vector::borrow_mut(&mut grid_state.models, i);
            if (model.id == model_id) {
                model_found = true;
                
                // Check if user has enough balance
                let user_balance = coin::balance<AptosCoin>(account_addr);
                assert!(user_balance >= model.price_per_inference, E_INSUFFICIENT_BALANCE);
                
                // Transfer payment from user to model owner
                if (model.price_per_inference > 0) {
                    coin::transfer<AptosCoin>(account, model.owner, model.price_per_inference);
                };
                
                // Update inference count
                model.total_inferences = model.total_inferences + 1;
                grid_state.total_inferences = grid_state.total_inferences + 1;
                
                break
            };
            i = i + 1;
        };
        
        assert!(model_found, E_MODEL_NOT_FOUND);
    }

    /// Get total number of models
    #[view]
    public fun get_total_models(): u64 acquires AIGridState {
        let grid_addr = @aptosai_grid;
        if (!exists<AIGridState>(grid_addr)) {
            return 0
        };
        
        let grid_state = borrow_global<AIGridState>(grid_addr);
        grid_state.total_models
    }

    /// Get total number of inferences
    #[view]
    public fun get_total_inferences(): u64 acquires AIGridState {
        let grid_addr = @aptosai_grid;
        if (!exists<AIGridState>(grid_addr)) {
            return 0
        };
        
        let grid_state = borrow_global<AIGridState>(grid_addr);
        grid_state.total_inferences
    }

    /// Get model by ID
    #[view]
    public fun get_model(model_id: u64): (u64, String, String, address, u64, u64, u64) acquires AIGridState {
        let grid_addr = @aptosai_grid;
        assert!(exists<AIGridState>(grid_addr), E_NOT_INITIALIZED);
        
        let grid_state = borrow_global<AIGridState>(grid_addr);
        let models_len = vector::length(&grid_state.models);
        let i = 0;
        
        while (i < models_len) {
            let model = vector::borrow(&grid_state.models, i);
            if (model.id == model_id) {
                return (
                    model.id,
                    model.name,
                    model.description,
                    model.owner,
                    model.price_per_inference,
                    model.total_inferences,
                    model.created_at
                )
            };
            i = i + 1;
        };
        
        abort E_MODEL_NOT_FOUND
    }
}