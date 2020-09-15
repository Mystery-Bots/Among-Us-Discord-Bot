module.exports = {
    database: {
        user: 'Username',
        host: 'IP',
        database: 'Database',
        password: 'Password',
        port: 3306,
        bigNumberStrings: true,
        supportBigNumbers: true,
        multipleStatements: true,
        typeCast: function castField( field, useDefaultTypeCasting ) { // Bool Support
            if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
                var bytes = field.buffer();
                return( bytes[ 0 ] === 1 );
            }
            return( useDefaultTypeCasting() );
        }
    },
    discord:{
        token: "Your Token Here",
        prefix: "-",
        devs: ["Dev ID"],
        ignore: ["Server ID"]
    }
}