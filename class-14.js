class Zametka {
  constructor() {
    this.api = "http://localhost:3000/data";
    this.box = document.querySelector(".box");

    this.addDialog = document.querySelector(".addDialog");
    this.addForm = document.querySelector(".addForm");

    this.editDialog = document.querySelector(".editDialog");
    this.editForm = document.querySelector(".editForm");

    this.infoDialog = document.querySelector(".infoDialog");
    this.infoTitle = document.querySelector(".infoTitle");
    this.infoTask = document.querySelector(".infoTask");
    this.infoStatus = document.querySelector(".infoStatus");
    this.infoId = document.querySelector(".infoId");

    this.inpSearch = document.querySelector(".inpSearch");
    this.statusSearch = document.querySelector(".statusSearch");
    this.btnNewTask = document.querySelector(".btnNewTask");

    this.btnaddClose = document.querySelector(".btnaddClose");
    this.btnaddClose.onclick = () => {
      this.addDialog.close();
    };
    this.btneditClose = document.querySelector(".btneditClose");
    this.btneditClose.onclick = () => {
      this.editDialog.close();
    };
    this.btninfoClose = document.querySelector(".btninfoClose");
    this.btninfoClose.onclick = () => {
      this.infoDialog.close();
    };

    this.inpSearch.oninput = async () => {
      try {
        let res = await fetch(`${this.api}?title=${this.inpSearch.value}`);
        let data = await res.json();
        this.getData(data);
      } catch (error) {}
    };
    this.statusSearch.onchange = async () => {
      if (this.statusSearch.value == "all") {
        this.get();
      } else {
        try {
          let res = await fetch(
            `${this.api}?status=${this.statusSearch.value == "active"}`
          );
          let data = await res.json();
          this.getData(data);
        } catch (error) {}
      }
    };

    this.btnNewTask.onclick = () => {
      this.addDialog.showModal();
    };

    this.addForm.onsubmit = async (event) => {
      event.preventDefault();
      try {
        await fetch(this.api, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            title: event.target["addTitle"].value,
            description: event.target["addTask"].value,
            status: event.target["addStatus"].value == "active",
            id: Date.now().toString(),
          }),
        });
        this.addDialog.close();
        this.get();
      } catch (error) {}
    };

    this.editForm.onsubmit = async (event) => {
      event.preventDefault();
      try {
        let res = await fetch(`${this.api}/${this.idx}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            title: event.target["editTitle"].value,
            description: event.target["editTask"].value,
            status: event.target["editStatus"].value == "active",
            id: Date.now().toString(),
          }),
        });
        this.editDialog.close();
        this.get();
      } catch (error) {}
    };

    this.get();
  }

  async get() {
    try {
      let res = await fetch(this.api);
      let data = await res.json();
      this.getData(data);
    } catch (error) {}
  }

  getData(data) {
    this.box.innerHTML = "";
    data.forEach((e) => {
      let div = document.createElement("div");
      div.classList.add("div");

      let title = document.createElement("h2");
      title.innerHTML = e.title;

      let description = document.createElement("p");
      description.innerHTML = e.description;
      description.style.padding = " 10px 0px";

      let pStatus = document.createElement("p");
      pStatus.innerHTML = e.status ? "active" : "inactive";

      let btndele = document.createElement("button");
      btndele.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
      btndele.onclick = () => {
        this.deleteUser(e.id);
      };
      btndele.style.color = "red";

      let btnedit = document.createElement("button");
      btnedit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>`;
      btnedit.onclick = () => {
        this.editDialog.showModal();
        this.editForm["editTitle"].value = e.title;
        this.editForm["editTask"].value = e.description;
        this.editForm["editStatus"].value = e.status ? "active" : "inactive";
        this.idx = e.id;
      };
      let btninfo = document.createElement("button");
      btninfo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`;
      btninfo.onclick = () => {
        this.infoTask(e.id);
      };

      let check = document.createElement("input");
      check.classList.add("check");
      check.type = "checkbox";
      check.checked = !e.status;
      check.onclick = () => {
        this.changeStatus(e);
      };

      let div1 = document.createElement("div");
      let div2 = document.createElement("div");
      div1.style.display = "flex"
      div1.style.alignItems = "center"
      div2.style.display = "flex"
      div2.style.alignItems = "center"
      let divActions = document.createElement("div");
      divActions.classList.add("divActions");

      div1.append(btnedit, btndele);
      div2.append(btninfo, check);
      divActions.append(div1, div2);

      title.style.textDecoration = !e.status ? "line-through" : "none";
      div.append(title, description, pStatus, divActions);
      this.box.append(div);
    });
  }

  async changeStatus(e) {
    try {
      await fetch(`${this.api}/${e.id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          ...e,
          status: !e.status,
        }),
      });
      this.get();
    } catch (error) {}
  }

  async deleteUser(id) {
    try {
      await fetch(`${this.api}/${id}`, {
        method: "DELETE",
      });
      this.get();
    } catch (error) {}
  }

  async infoTask(id) {
    try {
      let res = await fetch(`${this.api}/${id}`);
      let data = await res.json();
      this.getInfo(data);
    } catch (error) {}
  }

  getInfo(e) {
    this.infoName.innerHTML = e.title;
    this.infoAge.innerHTML = e.description;
    this.infoStatus.innerHTML = e.status ? "active" : "inactive";
    this.infoId.innerHTML = e.id;
    this.infoDialog.showModal();
  }
}
new Zametka();
