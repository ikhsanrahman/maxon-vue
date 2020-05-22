<template>
  <div>
    <h2><span class='el-icon-paperclip'> Purchase Order</span></h2>
    <template>
      <el-button @click="saveDoc()" size="mini" type="primary"><span class='el-icon-coin'> Save</span></el-button>
      <el-button @click="printDoc()" size="mini" type="warning"><span class='el-icon-printer'> Print</span></el-button>
    </template>
    <i style='color:red'>{{message}}</i>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="20">
      <el-form ref="form" :model="form" label-width="120px">
          <el-col :span="10">
            <el-form-item label="Nomor SO#">
              <el-input v-model="form.purchase_order_number"></el-input>
            </el-form-item>                  
            <el-form-item label="Tanggal">
              <el-date-picker
              v-model="form.po_date"
              type="datetime"
              placeholder="Select date and time"
              default-time="12:00:00">
              </el-date-picker>                              
            </el-form-item>
            <el-form-item label="Termin">
              <el-input v-model="form.terms"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="Supplier">
                <el-input v-model="form.supplier_number"></el-input>
            </el-form-item>                  
            <el-form-item label="Comments">
              <el-input v-model="form.comments" type="textarea"></el-input>
            </el-form-item>
          </el-col>
      </el-form>         
      </el-col>
    </el-row>
    <el-row>
      <h3><span class='el-icon-tickets'> Data Items</span></h3>
      <el-button @click="addRow()" size="mini" type="primary"><span class='el-icon-document-add'> Add Row</span></el-button>
      <el-button @click="loadItems()" size="mini" type="success" ><span class='el-icon-refresh-left'> Refresh</span></el-button>
      <el-divider></el-divider>
      <el-table style="width: 100%" :data="tableData">
        <el-table-column v-for="col in columns"  :label="col.label" :prop="col.field" 
            v-bind:key="col"  v-model="tableColumn">
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button @click.native.prevent="editRow(scope.$index, scope.row)" size="mini" type="primary" >Edit</el-button>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.$index, scope.row)"  size="mini"  type="danger" >Del</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-row>

    <DialogItem ref="dlgItemInput"></DialogItem>

  </div>
</template>

<script>
  import axios from 'axios'
  import DialogItem from "~/components/DialogItem.vue";

  export default {
    components: {
      DialogItem
    },
    head: {
      title: 'Sales Order View'
    },
    data(){
      return {
        message:'',
        tableData: [{item_number: 'Loading...'}],
        form: {
          purchase_order_number: this.$route.params.id,
          supplier_number: 'CASH',
          po_date: new Date(),
          terms: 'KREDIT',
          comments: '',
        },
        columns: [
          {label: "Item Number", field:"item_number"},
          {label: "Description", field:"description"},
          {label: "Qty", field:"quantity"},
          {label: "Unit", field:"unit"},
          {label: "Price", field:"price"},
          {label: "Disc%", field:"discount"},
          {label: "Jumlah", field:"total_price"},
        ],
        addCount: 0,
        listItems: [],
        item_search: '',

      }  
    },
    mounted() {
      this.getData();
      this.loadItems();
    },
    methods: {
      saveDoc() {
        const formData = new FormData()
        Object.keys(this.form).forEach((key) => {
            formData.append(key, this.form[key])
        })
        formData.append("mode",this.mode);

        var vUrl='/api/purchase_order/save';

        axios.post(vUrl,formData)
            .then((Response) => {
              console.log(Response);
              if(Response.data.success){
                this.message="Success";
                alert("Data sudah disimpan");
              } else {
                this.message=Response.data.msg;
              }
            })
            .catch((err) => {
                this.message=err
            })        
      },
      printDoc() {
        var vUrl='/api/purchase_order/print_po/'+this.form.purchase_order_number;
        window.open(vUrl,"_blank")

      },
      deleteDoc() {
        this.$confirm('Are you sure delete this document ?')
          .then(_ => {
          var vUrl='/api/purchase_order/delete/'+this.form.purchase_order_number;
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
                window.open("/api/purchase_order","_self");
            })
            .catch((err) => {
                this.message=err;
            })
        })
        .catch(_ => {});        
      },
      getData(){
        var vUrl='/api/purchase_order/view/'+this.form.purchase_order_number+"?json=true";
        axios.get(vUrl)
        .then((Response) => {
            this.form.purchase_order_number = Response.data.purchase_order_number;
            this.form.po_date=Response.data.po_date;
            this.form.supplier_number=Response.data.supplier_number;
            this.form.terms=Response.data.terms;
            this.form.comments=Response.data.comments;
        })
        .catch((err) => {
            this.message=err;
        })
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },            
      loadItems(){
        this.message="Loading...";
        var vUrl='/api/purchase_order/items/'+this.form.purchase_order_number+"?json=true";
        axios.get(vUrl)
          .then((Response) => {
              this.tableData = Response.data.rows;
              this.message="Ready.";
          })
          .catch((err) => {
              this.message=err;
          })        
      },
      addRow:function(){
        this.dialogVisible=true;
        var dlg = this.$refs.dlgItemInput
        dlg.nomor_bukti=this.form.purchase_order_number
        dlg.showDialog()
        
      },
      addRowLine:function(){
        let newRow  = {label:"",prop:""};
        this.tableData = [newRow,...this.tableData];
        ++ this.addCount;
      },
      editRow(index,row){
        this.dialogVisible=true
        var dlg = this.$refs.dlgItemInput
        dlg.nomor_bukti=this.form.purchase_order_number
        dlg.item_number=row.item_number
        dlg.showDialog()

      },
      saveRow(index, rows) { 
        var vUrl='/api/purchase_order/save_item';
        var formData = new FormData()
        formData.append("purchase_order_number",this.form.purchase_order_number);
        formData.append("item_number",rows.item_number);
        formData.append("description",rows.description);
        formData.append("quantity",rows.quantity);
        formData.append("unit",rows.unit);
        formData.append("price",rows.price);
        formData.append("total_price",rows.total_price);
        if(rows.line_number) {
          formData.append("mode","edit");
          formData.append("line_number",rows.line_number);
        } else {
          formData.append("mode","add");
        } 

        this.message="Saving...";
        axios.post(vUrl,formData)
          .then((Response) => {              
              this.loadItems();
              this.message="Data sudah tersimpan."  ;
          })
          .catch((err) => {
              this.message=err;
          })
      },
      deleteRow(index, row) {
        this.$confirm('Are you sure delete this supplier ?')
          .then(_ => {
          var vUrl='/api/purchase_order/delete_item/'+this.tableData[index].line_number;
          axios.get(vUrl)
            .then((Response) => {
                this.message=Response.data.msg;
                this.loadItems();
            })
            .catch((err) => {
                this.message=err;
            })
        })
        .catch(_ => {});
      },
      querySearchItem(queryString, cb) {
        this.item_search=queryString 
        var links = this.listItems;
        var results = queryString ? links.filter(this.createFilter(queryString)) : links;
        // call callback function to return suggestions
        cb(results);
      },
      createFilter(queryString) {
        return (link) => {
          return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadItemPilih() {
        var vUrl='/api/inventory/browse_data/?tb_search='+this.item_search;
        axios.get(vUrl)
          .then((Response) => {
              this.message=Response.data.msg;
              var rows=Response.data.rows;
              for(var i=0;i<rows.length;i++){
                this.listItems.push({"value":rows[i].description,"link":rows[i].item_number});
              }
              console.log(this.listItems)
          })
          .catch((err) => {
              this.message=err;
          })

      },
      handleSelectItem(item) {
        console.log(item);
      }

    },
  }

</script>
<style>
.el-table__row .el-input .el-input__inner{
  border-style:solid 1px black;
}
.hover-row .el-input .el-input__inner{
  border-style:solid;   
}

</style>