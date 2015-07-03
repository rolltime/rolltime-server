## Rolltime Server


On the MongoDB shell (`mongo`), create an user using:
```
db.createUser({user: "rolltimedev", pwd: "YOUR_PASSWORD_HERE", roles: [{ role: "readWrite", db: "rolltime" },]})
```
