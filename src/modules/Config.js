module.exports = 
{
    server_host : "13.124.43.70",
    //server_host : "localhost",
    server_port : 3001,
    
    db_url : "mongodb://localhost:27017/Asgardium",
    db_schemas: 
    [
        { file:"./GlobalConfigSchema", collection:"global_config", schemaName:"GlobalConfigSchema", modelName:"GlobalConfigModel" }
        , { file:"./GlobalUnitDataSchema", collection:"global_unit_data", schemaName:"GlobalUnitDataSchema", modelName:"GlobalUnitDataModel" }
        
        , { file:"./InstanceMiningActiveCompanySchema", collection:"instance_mining_active_company", schemaName:"InstanceMiningActiveCompanySchema", modelName:"InstanceMiningActiveCompanyModel" }
        , { file:"./InstanceUsersSchema", collection:"instance_users", schemaName:"InstanceUsersSchema", modelName:"InstanceUsersModel" }
        , { file:"./InstanceUserInventoriesSchema", collection:"instance_user_inventories", schemaName:"InstanceUserInventoriesSchema", modelName:"InstanceUserInventoriesModel" }
        , { file:"./InstanceUserUpgradeInfoSchema", collection:"instance_user_upgrade_info", schemaName:"InstanceUserUpgradeInfoSchema", modelName:"InstanceUserUpgradeInfoModel" }
        
        , { file:"./MiningActiveCompanyNPCSchema", collection:"mining_active_company_npc", schemaName:"MiningActiveCompanyNPCSchema", modelName:"MiningActiveCompanyNPCModel" }
        , { file:"./MiningActiveQuantitySchema", collection:"mining_active_quantity", schemaName:"MiningActiveQuantitySchema", modelName:"MiningActiveQuantityModel" }
        , { file:"./MiningActiveSupplySchema", collection:"mining_active_supply", schemaName:"MiningActiveSupplySchema", modelName:"MiningActiveSupplyModel" }
        , { file:"./MiningActiveMaxMPSchema", collection:"mining_active_max_mp", schemaName:"MiningActiveMaxMPSchema", modelName:"MiningActiveMaxMPModel" }
        , { file:"./MiningActiveRechargeDelaySchema", collection:"mining_active_recharge_delay", schemaName:"MiningActiveRechargeDelaySchema", modelName:"MiningActiveRechargeDelayModel" }
    ],
    
    pre_load_collection:
    [
        "global_config"
        , "global_unit_data"
        , "mining_active_company_npc"
        , "mining_active_quantity"
        , "mining_active_supply"
        , "mining_active_max_mp"
        , "mining_active_recharge_delay"
    ],
    
    web_route_info:
    [
        // RouterTest
        {file:"./RouterTest", path:"/process/test", method:"test", type:"get"}
        , {file:"./RouterTest", path:"/process/test", method:"test", type:"post"}
        , {file:"./RouterTest", path:"/process/test_use_mining_power", method:"test_use_mining_power", type:"post"}
        , {file:"./RouterTest", path:"/process/test_reset_mining_power", method:"test_reset_mining_power", type:"post"}
        
        // RouterAuth
        , {file:"./RouterAuth", path:"/process/is_signup", method:"is_signup", type:"post"}
        , {file:"./RouterAuth", path:"/process/signup", method:"signup", type:"post"}
        , {file:"./RouterAuth", path:"/process/signin", method:"signin", type:"post"}
        
        // RouterUser
        , {file:"./RouterUser", path:"/process/instance_user_inventory", method:"instance_user_inventory", type:"post"}
        , {file:"./RouterUser", path:"/process/instance_user_upgrade_info", method:"instance_user_upgrade_info", type:"post"}
        , {file:"./RouterUser", path:"/process/instance_user_upgrade_active_power", method:"instance_user_upgrade_active_power", type:"post"}
        , {file:"./RouterUser", path:"/process/instance_user_upgrade_active_time", method:"instance_user_upgrade_active_time", type:"post"}
        
        // RouterMining
        , {file:"./RouterMining", path:"/process/purchase_unit_at_mining_active", method:"purchase_unit_at_mining_active", type:"post"}
        
        // RouterTable
        , {file:"./RouterTable", path:"/table/global_config", method:"global_config", type:"get"}
        , {file:"./RouterTable", path:"/table/global_unit_data", method:"global_unit_data", type:"get"}
        , {file:"./RouterTable", path:"/table/mining_active_company_npc", method:"mining_active_company_npc", type:"get"}
        , {file:"./RouterTable", path:"/table/mining_active_quantity", method:"mining_active_quantity", type:"get"}
        , {file:"./RouterTable", path:"/table/mining_active_supply", method:"mining_active_supply", type:"get"}
        , {file:"./RouterTable", path:"/table/instance_users", method:"instance_users", type:"get"}
        , {file:"./RouterTable", path:"/table/instance_mining_active_company", method:"instance_mining_active_company", type:"get"}
        , {file:"./RouterTable", path:"/table/mining_active_max_mp", method:"mining_active_max_mp", type:"get"}
        , {file:"./RouterTable", path:"/table/mining_active_recharge_delay", method:"mining_active_recharge_delay", type:"get"}
    ],
    
    socket_route_info:
    [
        // RouterCommon
        {file:"./RouterCommon", event_name:"force_disconnect", method:"force_disconnect"}
        , {file:"./RouterCommon", event_name:"test_message", method:"test_message"}
        
        // RouterMining
        , {file:"./RouterMining", event_name:"subscribe_mining_active_info", method:"subscribe_mining_active_info"}
        , {file:"./RouterMining", event_name:"unsubscribe_mining_active_info", method:"unsubscribe_mining_active_info"}
    ],
    
//    facebook : 
//    {
//        clientID : "222461698623162",
//        clientSecret : "d11df77b7e40b27705c4f81579254001",
//        callbackURL : "https://localhost:3000/auth/facebook/callback"
//    }
};