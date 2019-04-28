module.exports = 
{
    server_host : "13.124.43.70",
    //server_host : "localhost",
    server_port : 3001,
    certificate : "MIICizCCAfQCCQDwf4v6CJfa6TANBgkqhkiG9w0BAQsFADCBiTELMAkGA1UEBhMCa3IxDjAMBgNVBAgMBXNlb3VsMRAwDgYDVQQHDAdnYW5nbmFtMRMwEQYDVQQKDAptYW5nb25pZ2h0MRIwEAYDVQQLDAlhc2dhcmRpdW0xDDAKBgNVBAMMA2F3czEhMB8GCSqGSIb3DQEJARYSc2htaGxvdmVAbmF2ZXIuY29tMB4XDTE5MDIxMzE0MDYxN1oXDTE5MDMxNTE0MDYxN1owgYkxCzAJBgNVBAYTAmtyMQ4wDAYDVQQIDAVzZW91bDEQMA4GA1UEBwwHZ2FuZ25hbTETMBEGA1UECgwKbWFuZ29uaWdodDESMBAGA1UECwwJYXNnYXJkaXVtMQwwCgYDVQQDDANhd3MxITAfBgkqhkiG9w0BCQEWEnNobWhsb3ZlQG5hdmVyLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEA9I4ydsDhikcLXt6UfzquTmuWhqpsEuQx+30I69voyRPoD5k3y42HDvBgolwCwximBfUuMX/+lpe9kBWC7Zk+dwldSmGB2mTM5gypLx3deU+uTTEnnO7dG1ARvF7NMwPXaqRsQpAEhvLkKUBNA61N7j9a5o12st/qU9WQUm5ycYECAwEAATANBgkqhkiG9w0BAQsFAAOBgQBkzdMbx9PT2UntCMSbRXnEWL8Qcxv2U1u8TjZph4qn1P11xG05DNCHHulOGVAKspUGkpyMw1/VoiaEKd2J7rPPHDJ6oZj5MsUm2weuERS9UOMDOjvBvfLmoZcPrR0TMPivu1EmyuoBtSab0X4JQbzYCVhqPlQ3RE2Mkh9gv8gS+w==",
    
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