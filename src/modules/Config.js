module.exports = 
{
    //server_host : "13.124.43.70",
    server_host : "localhost",
    server_port : 3001,
    
    db_url : "mongodb://localhost:27017/Asgardium",
    db_schemas: 
    [
        { file:"./GlobalConfigSchema", collection:"global_config", schemaName:"GlobalConfigSchema", modelName:"GlobalConfigModel" }
        , { file:"./GlobalUnitDataSchema", collection:"global_unit_data", schemaName:"GlobalUnitDataSchema", modelName:"GlobalUnitDataModel" }
        
        , { file:"./InstanceMiningActiveCompanySchema", collection:"instance_mining_active_company", schemaName:"InstanceMiningActiveCompanySchema", modelName:"InstanceMiningActiveCompanyModel" }
        , { file:"./InstanceUsersSchema", collection:"instance_users", schemaName:"InstanceUsersSchema", modelName:"InstanceUsersModel" }
        
        , { file:"./MiningActiveCompanyNPCSchema", collection:"mining_active_company_npc", schemaName:"MiningActiveCompanyNPCSchema", modelName:"MiningActiveCompanyNPCModel" }
        , { file:"./MiningActiveQuantitySchema", collection:"mining_active_quantity", schemaName:"MiningActiveQuantitySchema", modelName:"MiningActiveQuantityModel" }
        , { file:"./MiningActiveSupplySchema", collection:"mining_active_supply", schemaName:"MiningActiveSupplySchema", modelName:"MiningActiveSupplyModel" }
    ],
    
    pre_load_table:
    [
        "global_config", 
        "global_unit_data", 
        "mining_active_company_npc", 
        "mining_active_quantity", 
        "mining_active_supply"
    ],
    
    route_info:
    [
        {file:"./RouterTest", path:"/process/test", method:"test", type:"get"}
        , {file:"./RouterTest", path:"/process/test", method:"test", type:"post"}
        , {file:"./RouterTest", path:"/process/test_use_mining_power", method:"test_use_mining_power", type:"post"}
        , {file:"./RouterTest", path:"/process/test_reset_mining_power", method:"test_reset_mining_power", type:"post"}
        
        , {file:"./RouterAuth", path:"/process/signup", method:"signup", type:"post"}
        , {file:"./RouterAuth", path:"/process/signin", method:"signin", type:"post"}
        
        , {file:"./RouterTable", path:"/table/global_config", method:"global_config", type:"get"}
        , {file:"./RouterTable", path:"/table/global_unit_data", method:"global_unit_data", type:"get"}
        , {file:"./RouterTable", path:"/table/mining_active_company_npc", method:"mining_active_company_npc", type:"get"}
        , {file:"./RouterTable", path:"/table/mining_active_quantity", method:"mining_active_quantity", type:"get"}
        , {file:"./RouterTable", path:"/table/mining_active_supply", method:"mining_active_supply", type:"get"}
        , {file:"./RouterTable", path:"/table/instance_users", method:"instance_users", type:"get"}
        , {file:"./RouterTable", path:"/table/instance_mining_active_company", method:"instance_mining_active_company", type:"get"}
    ],
    
//    facebook : 
//    {
//        clientID : "222461698623162",
//        clientSecret : "d11df77b7e40b27705c4f81579254001",
//        callbackURL : "https://localhost:3000/auth/facebook/callback"
//    }
};