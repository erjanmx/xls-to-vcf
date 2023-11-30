Vue.component("multiselect", window.VueMultiselect.default);
new Vue({
  el: "#app",
  data: {
    data: [],
    filename: "",
    fields: [
      { code: "N", description: "First name", values: [] },
      { code: "N_FAMILY", description: "Last name", values: [] },
      {
        code: "TEL;TYPE=VOICE,CELL;VALUE=text",
        description: "Mobile phone",
        values: [],
      },
      {
        code: "TEL;TYPE=VOICE,WORK;VALUE=text",
        description: "Work tel",
        values: [],
      },
      {
        code: "TEL;TYPE=VOICE,HOME;VALUE=text",
        description: "Home tel",
        values: [],
      },
      {
        code: "EMAIL;TYPE=HOME;TYPE=pref;TYPE=INTERNET",
        description: "E-Mail",
        values: [],
      },
      { code: "ORG", description: "Company", values: [] },
      { code: "TITLE", description: "Title", values: [] },
      { code: "NOTE", description: "Notes", values: [] },
    ],
  },
  computed: {
    tableHeaders() {
      if (this.data.length > 0) {
        return Object.keys(this.data[0]);
      }
      return [];
    },
    firstThreeRows() {
      if (this.data.length > 0) {
        return this.data.slice(0, 3);
      }
      return [];
    },
    lastRow() {
      if (this.data.length > 0) {
        return this.data.slice(-1)[0];
      }
    },
  },
  methods: {
    readFile() {
      let self = this;
      const file = this.$refs.file.files[0];
      self.filename = file.name;
      const reader = new FileReader();
      reader.onload = function (e) {
        const workbook = XLSX.read(new Uint8Array(e.target.result), {
          type: "array",
        });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        self.data = XLSX.utils.sheet_to_json(sheet);
      };
      reader.readAsArrayBuffer(file);
    },
    handleDownloadButton() {
      const blob = new Blob([this.buildVcf()], { type: "text/vcard" });
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "contacts.vcf";
      downloadLink.click();
    },
    buildVcf() {
      let self = this;
      let result = "";

      this.data.forEach((contact) => {
        result += `BEGIN:VCARD\r\n`;
        result += `VERSION:3.0\r\n`;

        for (const item of self.fields) {
          if (item.value) {
            let value = "";
            for (const v of item.value) {
              value += " " + contact[v];
            }
            result += `${item.code}:${value.trim()}\r\n`;
          }
        }
        result += `END:VCARD\r\n\r\n`;
      });

      return result;
    },
  },
});
