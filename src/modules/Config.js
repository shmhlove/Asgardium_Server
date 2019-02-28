module.exports = 
{
    server_host : "13.124.43.70",
    //server_host : "localhost",
    server_port : 3001,
    server_port_for_https : 3002,
    
    db_url : "mongodb://localhost:27017/Asgardium",
    db_schemas: 
    [
        { file:"./UserSchema", collection:"users", schemaName:"UserSchema", modelName:"UserModel" },
        { file:"./ConfigSchema", collection:"config", schemaName:"ConfigSchema", modelName:"ComfigModel" },
        { file:"./OracleCompanyAMSchema", collection:"oracle_company_am", schemaName:"OracleCompanyAMSchema", modelName:"OracleCompanyAMModel" }
    ],
    
    route_info:
    [
        {file:"./RouterTest", path:"/process/test", method:"test", type:"get"},
        {file:"./RouterTest", path:"/process/test", method:"test", type:"post"},
        {file:"./RouterTest", path:"/process/test_use_mining_power", method:"test_use_mining_power", type:"post"},
        {file:"./RouterTest", path:"/process/test_reset_mining_power", method:"test_reset_mining_power", type:"post"},
        {file:"./RouterAuth", path:"/process/signup", method:"signup", type:"post"},
        {file:"./RouterAuth", path:"/process/login", method:"login", type:"post"},
        {file:"./RouterTable", path:"/static/config", method:"config", type:"get"},
        {file:"./RouterTable", path:"/static/oracle_company_am", method:"oracle_company_am", type:"get"}
    ],
    
//    facebook : 
//    {
//        clientID : "222461698623162",
//        clientSecret : "d11df77b7e40b27705c4f81579254001",
//        callbackURL : "https://localhost:3000/auth/facebook/callback"
//    }
};