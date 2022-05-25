
import "https://deno.land/x/xhr@0.1.1/mod.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
installGlobals();
import firebase from "https://cdn.skypack.dev/firebase@8.7.0/app";
import "https://cdn.skypack.dev/firebase@8.7.0/auth";
import "https://cdn.skypack.dev/firebase@8.7.0/firestore";
import {
    Application,
    Router,
    Status,
  } from "https://deno.land/x/oak@v7.7.0/mod.ts";
  import { virtualStorage } from "https://deno.land/x/virtualstorage@0.1.0/middleware.ts";
const firebaseConfig = JSON.parse(Deno.env.get("FIREBASE_CONFIG"));
const firebaseApp = firebase.initializeApp(firebaseConfig, "example");
const auth = firebase.auth(firebaseApp);
const db = firebase.firestore(firebaseApp);
const router = new Router();

// Returns any songs in the collection
router.get("/songs", async (ctx) => {
  const querySnapshot = await db.collection("songs").get();
  ctx.response.body = querySnapshot.docs.map((doc) => doc.data());
  ctx.response.type = "json";
});

// Returns the first document that matches the title
router.get("/songs/:title", async (ctx) => {
  const { title } = ctx.params;
  const querySnapshot = await db.collection("songs").where("title", "==", title)
    .get();
  const song = querySnapshot.docs.map((doc) => doc.data())[0];
  if (!song) {
    ctx.response.status = 404;
    ctx.response.body = `The song titled "${ctx.params.title}" was not found.`;
    ctx.response.type = "text";
  } else {
    ctx.response.body = querySnapshot.docs.map((doc) => doc.data())[0];
    ctx.response.type = "json";
  }
});

function isSong(value) {
  return typeof value === "object" && value !== null && "title" in value;
}

// Removes any songs with the same title and adds the new song
router.post("/songs", async (ctx) => {
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.throw(Status.BadRequest, "Must be a JSON document");
  }
  const song = await body.value;
  if (!isSong(song)) {
    ctx.throw(Status.BadRequest, "Payload was not well formed");
  }
  const querySnapshot = await db
    .collection("songs")
    .where("title", "==", song.title)
    .get();
  await Promise.all(querySnapshot.docs.map((doc) => doc.ref.delete()));
  const songsRef = db.collection("songs");
  await songsRef.add(song);
  ctx.response.status = Status.NoContent;
});

const app = new Application();
app.use(virtualStorage());

app.use(async (ctx, next) => {
    const signedInUid = ctx.cookies.get("LOGGED_IN_UID");
    const signedInUser = signedInUid != null ? users.get(signedInUid) : undefined;
    if (!signedInUid || !signedInUser || !auth.currentUser) {
      const creds = await auth.signInWithEmailAndPassword(
        Deno.env.get("FIREBASE_USERNAME"),
        Deno.env.get("FIREBASE_PASSWORD"),
      );
      const { user } = creds;
      if (user) {
        users.set(user.uid, user);
        ctx.cookies.set("LOGGED_IN_UID", user.uid);
      } else if (signedInUser && signedInUid.uid !== auth.currentUser?.uid) {
        await auth.updateCurrentUser(signedInUser);
      }
    }
    return next();
  });

  app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });