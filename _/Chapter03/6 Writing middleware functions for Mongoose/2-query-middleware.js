const mongoose = require('mongoose')
const { connection, Schema } = mongoose

mongoose.connect(
	'mongodb://test:test@localhost:7331/test'
).catch(console.error)

const UserSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
})

UserSchema.pre('count', async function preCount() {
	console.log(
		`Preparing to count document with this criteria:
		${JSON.stringify(this._conditions)}`
	)
})
UserSchema.post('count', async function postCount(count) {
	console.log(`Counted ${count} documents that coincide`)
})
UserSchema.pre('find', async function preFind() {
	console.log(
		`Preparing to find all documents with criteria:
		${JSON.stringify(this._conditions)}`
	)
})
UserSchema.post('find', async function postFind(docs) {
	console.log(`Found ${docs.length} documents`)
})

UserSchema.pre('findOne', async function prefOne() {
	console.log(
		`Preparing to find one document with criteria:
		${JSON.stringify(this._conditions)}`
	)
})
UserSchema.post('findOne', async function postfOne(doc) {
	console.log(`Found 1 document:`, JSON.stringify(doc))
})

UserSchema.pre('update', async function preUpdate() {
	console.log(
		`Preparing to update all documents with criteria:
		${JSON.stringify(this._conditions)}`
	)
})
UserSchema.post('update', async function postUpdate(r) {
	console.log(`${r.result.ok} document(s) were updated`)
})

const User = mongoose.model('User', UserSchema)

connection.once('connected', async () => {
	try {
		const user = new User({
			firstName: 'John',
			lastName: 'Smith',
		})
		await user.save()
		await User
			.where('firstName').equals('John')
			.update({ lastName: 'Anderson' })
		await User
			.findOne()
			.select(['lastName'])
			.where('firstName').equals('John')
		await User
			.find()
			.where('firstName').equals('John')
		await User
			.where('firstName').equals('Neo')
			.count()
		await user.remove()
	} catch (error) {
		console.dir(error, { colors: true })
	} finally {
		await connection.close()
	}
})
