import { defineStore } from "pinia";
import { db } from "@/firebase";
import { doc, query, collection, onSnapshot } from "firebase/firestore";

export const companyStore = defineStore({
  id: "company",
  state: () => ({
    id: null,
    isCompanyLoaded: false,
    isMemberListLoaded: false,
    isProjectListLoaded: false,
    name: "",
    "default-gross-margin": 0,
    "default-human-cost-rat": 0,
    memberList: [],
    projectList: [],
    firebaseUnsubscribes: {
      company: () => {},
      members: () => {},
      projects: () => {},
    },
  }),
  actions: {
    setId(id) {
      // different id, reset all
      if (this.id !== id) {
        this.isCompanyLoaded = false;
        this.isMemberListLoaded = false;
        this.isProjectListLoaded = false;
        this.name = "";
        this["default-gross-margin"] = 0;
        this["default-human-cost-rat"] = 0;
        this.memberList = [];
        this.projectList = [];
      }
      this.id = id;
    },
    subscribeCompany() {
      const cmpUnsub = onSnapshot(doc(db, "company", this.id), (docSnap) => {
        this.id = docSnap.id;
        this.name = docSnap.data().name;
        this["default-gross-margin"] = docSnap.data()["default-gross-margin"];
        this["default-human-cost-rat"] =
          docSnap.data()["default-human-cost-rat"];
        this.isCompanyLoaded = true;
      });
      this.firebaseUnsubscribes.company = cmpUnsub;
    },
    subscribeMembers() {
      const mq = query(collection(db, "company", this.id, "member"));
      const memberUnsub = onSnapshot(mq, (querySnapshot) => {
        this.memberList = [];
        querySnapshot.forEach((doc) => {
          console.log("members", doc.data());
          const m = {
            id: doc.id,
            avatar: doc.data().avatar,
            name: doc.data().name,
            position: doc.data().position,
            projectNum: doc.data()["projectNum"],
          };
          this.memberList.push(m);
        });
        this.isMemberListLoaded = true;
      });
      this.firebaseUnsubscribes.members = memberUnsub;
    },
    subscribeProjects() {
      const pq = query(collection(db, "company", this.id, "project"));
      const projectUnsub = onSnapshot(pq, (querySnapshot) => {
        this.projectList = [];
        querySnapshot.forEach((doc) => {
          console.log("project", doc.data());
          const p = {
            id: doc.id,
            avatar: doc.data().avatar,
            name: doc.data().name,
            position: doc.data().position,
            projectNum: doc.data()["projectNum"],
          };
          this.projectList.push(p);
        });
        this.isProjectListLoaded = true;
      });
      this.firebaseUnsubscribes.projects = projectUnsub;
    },
    unsubscribe(key) {
      this.firebaseUnsubscribes[key]();
    },
  },
});
