const fs = require("fs"); //fs module bawaan node js
const express = require('express') //panggil express assigne ke variabel

const app = express() //panggil package
const PORT = 8000; // panggil port

//untuk membaca json dari request ke body kita
app.use(express.json());

// baca isi file dari dummy.json
const customers = JSON.parse(
    fs.readFileSync(`${__dirname}/data/dummy.json`)
)


const defaultRouter = (req, res, next) => {
    res.send ('<p> Hello fsw tercinta</p>');

};

const getCustomerData = (req, res, next) => {
    res.status(200).json({
        status : "success",
        totalData : customers.length,
        data:{
            customers,
        },
    });
};

const getCustomerById = (req, res, next) => {
    const id = req.params.id;

    //menggunakan array methode untuk membantu menemukan data spesifik data
    const customer = customers.find((cust) => cust._id === id);

    res.status(200).json({
        status : "success",
        data:{
            customer,
        },
    });
};

const updateCustomerData =  (req, res) => {
    console.log ("masuk edit ga")
    const id = req.params.id

    //1 melakukan pencarian data yang sesuai parameter idnya ada gak
    const customer = customers.find(cust => cust._id === id);
    const customerIndex = customers.findIndex(cust => cust._id === id);

    //2. ada ga data customernya
    if(!customer) {
        return res.status(404).json({ // not found
            status: "fail",
            message: `Customer dengan id : ${id} ga ada`,
        });
    }

    // 3. kalau ada, bararti update data sesuai req body dari client/user
    // oject asign = menggabungkan objek

    customers [customerIndex] = {...customers[customerIndex], ...req.body};
    console.log(customers[customerIndex]);

    // 4. melakukan update di dokumen jsonnya
    fs.writeFile(
        `${__dirname}/data/dummy.json`,
         JSON.stringify(customers),
         (err) => {
            res.status(200).json({
                status: "success",
                message: "berhasil update data",
            });
         }
    );
};

const deleteCustomerData = (req, res) => {
    const id = req.params.id

    //1 melakukan pencarian data yang sesuai parameter idnya ada gak
    const customer = customers.find(cust => cust._id === id);
    const customerIndex = customers.findIndex(cust => cust._id === id);

    //2. ada ga data customernya
    if(!customer) {
        return res.status(404).json({ // not found
            status: "fail",
            message: `Customer dengan id : ${id} ga ada`,
        });
    }

    // 3. kalau ada, bararti delete datanya
    customers.splice(customerIndex, 1);

    // 4. melakukan update di dokumen jsonnya
    fs.writeFile(
        `${__dirname}/data/dummy.json`,
         JSON.stringify(customers),
         (err) => {
            res.status(200).json({
                status: "success",
                message: "berhasil delete data",
            });
         }
    );
};

const createCustomerData = (req, res) => {
    console.log(req.body);

    const newCustomer = req.body

   customers.push(newCustomer);

   fs.writeFile(`${__dirname}/data/dummy.json`, JSON.stringify(customers), err =>{
    res.status(201).json({
        status : 'success',
        data: {
            customer: newCustomer,
        }
    }) // 201 = created
   })
};

app.get('/', defaultRouter);
app.route("/api/v1/customers"). get(getCustomerData).post(createCustomerData);
app
    .route("/api/v1/customers/:id")
    .get(getCustomerById)
    .patch(updateCustomerData)
    .delete(deleteCustomerData);

app.listen(PORT,() => {
    console.log(`App Running on Port :${PORT}`)
});
