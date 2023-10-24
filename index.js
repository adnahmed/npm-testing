const { Sequelize, DataTypes } = require('sequelize');


// MySQL v8
const configv8 = {
  host: 'localhost',
  username: 'root',
  password: 'test_db8',
  database: 'test_db',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
const sequelizev8 = new Sequelize(configv8.database, configv8.username, configv8.password, {
    host: configv8.host,
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: configv8.pool.max,
        min: configv8.pool.min,
        acquire: configv8.pool.acquire,
        idle: configv8.pool.idle,
    },
});

// MySQL v5
const configv5 = {
  host: 'localhost',
  username: 'root',
  password: 'test_db5',
  database: 'test_db',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
const sequelizev5 = new Sequelize(configv5.database, configv5.username, configv5.password, {
    host: configv5.host,
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: configv5.pool.max,
        min: configv5.pool.min,
        acquire: configv5.pool.acquire,
        idle: configv5.pool.idle,
    },
});


const Userv8 = sequelizev8.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  }
});

const Userv5 = sequelizev5.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  }
});

async function test_rollback5() {
	await Userv5.destroy({ truncate: true });
	const t = await sequelizev5.transaction();
	try {
		const user = await Userv5.create({ firstName: 'adnan', lastName: 'khan' }, {transaction: t});
		throw new Error();
	} catch (err) {
	await t.rollback();
	const users = await Userv5.findAll();
	if (users.length > 0) console.log('Rollback v5 failed');
	else console.log('Rollback v5 passed');
	}
}

async function test_rollback8() {
	await Userv8.destroy({ truncate: true });
	const t = await sequelizev8.transaction();
	try {
		const user = await Userv8.create({ firstName: 'adnan', lastName: 'khan' }, {transaction: t});
		throw new Error();
	} catch (err) {
	await t.rollback();
	const users = await Userv8.findAll();
	if (users.length > 0) console.log('Rollback v8 failed');
	else console.log('Rollback v8 passed');
	}
}
	
test_rollback5();
test_rollback8();
