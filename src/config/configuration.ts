export default () => ({
    database: {
        port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    },
    gismeteo: {
        lang: process.env.GISMETEO_LANG || 'en',
        key: process.env.GISMETEO_API_KEY,
        days: parseInt(process.env.GISMETEO_DAYS) || 10
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expires: process.env.JWT_EXPIRES
    }
})