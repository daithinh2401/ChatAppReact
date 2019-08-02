// import Realm from 'realm'

// export const USER_SCHEMA = "user_schema";

// export const UserSchema = {
//     name: USER_SCHEMA,
//     primaryKey: "id",
//     properties: {
//         id: "string",
//         uid: { type: "string", indexed: true },
//         name: { type: "string", indexed: true },
//         hasAuthorized: { type: "bool", default: false }
//     }
// }

// const databaseOptions = {
//     path: 'userInfomation.realm',
//     schema: [UserSchema],
//     schemaVersion: 0, //optional
// };

// export const insertUser = user => new Promise((resolve,reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             realm.create(USER_SCHEMA,user);
//             resolve(user);
//         });
//     }).catch((error) => reject(error))
// });

// export const updateUser = user => new Promise((resolve,reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             let updatingUser = realm.objectForPrimaryKey(UserSchema,user.id);
//             updatingUser.uid = user.uid;
//             updatingUser.name = user.name;
//             updatingUser.hasAuthorized = user.hasAuthorized;
//             resolve();
//         });
//     }).catch((error) => reject(error))
// });

// export const deleteUser = id => new Promise((resolve,reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             let deletingUser = realm.objectForPrimaryKey(UserSchema,id);
//             realm.delete(deletingUser);
//             resolve();
//         });
//     }).catch((error) => reject(error))
// });

// export const queryUser = () => new Promise((resolve,reject) => {
//     Realm.open(databaseOptions).then(realm => {
//         realm.write(() => {
//             let user = realm.objects(USER_SCHEMA);
//             resolve(user);
//         });
//     }).catch((error) => reject(error))
// }); 

// export default new Realm(databaseOptions);