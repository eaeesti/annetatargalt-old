module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'annetusplatvorm'),
        username: env('DATABASE_USERNAME', 'andri'),
        password: env('DATABASE_PASSWORD', 'postgres'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
