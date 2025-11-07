import express from "express";
//import appServer from "./app/server";
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
	
	console.log(`Server is listening on port ${port}`);
});