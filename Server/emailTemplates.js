import axios from "axios";

export const sendOtpTemplate = (otp, email) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Login OTP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .otp {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            color: #007bff;
            margin: 20px 0;
            padding: 10px;
            background-color: #e9f5ff;
            border-radius: 5px;
        }
        .warning {
            color: #d9534f;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Your Login OTP for Samaira Fashion</h2>
        <p>Dear ${email},</p>
        <p>You have requested to log in to your Samaira Fashion account. Please use the following One-Time Password (OTP) to complete your login:</p>
        <div class="otp">${otp}</div>
        <p class="warning">Please do not share this code with anyone.</p>
        <p>If you did not request this login, please contact our support team immediately at <a href="mailto:support@samairafashion.com">support@samairafashion.com</a>.</p>
        <p>Best regards,<br>Samaira Fashion Security Team<br>+97 15216 60581<br>Deira, Dubai. UAE</p>
    </div>
</body>
</html>
    `
}

export const orderConfirmationTemplate = async (orderDetails) => {

    let data = ``;
    let sum = 0;
    let quantity = 0;
    let discount = 0;
    let deliveryCharge = 0;

    const response = await axios.get('https://www.floatrates.com/daily/aed.json');
    const dirham_to_rupees = Math.round(response.data.inr.rate);
    const isIndia = orderDetails.shippingDetails.country == 'India' ? true : false;

    for (let i = 0; i < orderDetails.products.length; i++) {

        const product = orderDetails.products[i];

        sum += product.price * orderDetails.cart[i].quantity;
        quantity += orderDetails.cart[i].quantity;
        data += `
        <tr>
                <td>${product.title}</td>
                <td>${orderDetails.cart[i].quantity}</td>
                <td>${isIndia ? product.price * orderDetails.cart[i].quantity : Math.floor(product.price * orderDetails.cart[i].quantity / dirham_to_rupees)}</td>
            </tr>
            `
    }

    if(quantity > 5) {
        discount = Math.floor(sum * 0.15);
    }
    else if(quantity > 2) {
        discount = Math.floor(sum * 0.1);
    }

    const country = orderDetails.shippingDetails.country;
    if(country.includes('United Arab Emirates')) {
        if(country.includes('Dubai') || country.includes('Shar') || country.includes('Ajman')){
            deliveryCharge = 0;
        } else {
            deliveryCharge = Math.floor(20 * dirham_to_rupees);
        }
    } else if(country.includes('India')) {
        deliveryCharge = 0;
    } else {
        deliveryCharge = Math.floor(70 * dirham_to_rupees);
    }

    if(!isIndia) {
        sum = Math.floor(sum / dirham_to_rupees);
        discount = Math.floor(discount / dirham_to_rupees);
        deliveryCharge = Math.floor(deliveryCharge / dirham_to_rupees);
    }

    if(deliveryCharge > 0) {
        data += `
                    <tr class="total">
                <td colspan="2">Delivery</td>
                <td>${deliveryCharge}</td>
            </tr>
        `
    }

    if(discount > 0) {
        data += `
                    <tr class="total">
                <td colspan="2">Discount</td>
                <td>${discount}</td>
            </tr>
        `
    }

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .order-number {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .cta-button {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Thank You for Your Order!</h2>
        <p>Dear ${orderDetails.shippingDetails.firstName + ' ' + orderDetails.shippingDetails.lastName},</p>
        <p>We're excited to confirm that your order has been received and is being processed. Here are the details of your purchase:</p>
        <p class="order-number">Order Number: #SF0${orderDetails._id.toString().slice(5, 10)}</p>
        <table>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price${isIndia ? '(Rs)' : '(AED)'}</th>
            </tr>
            ${data}
            <tr class="total">
                <td colspan="2">Total</td>
                <td>${sum - discount + deliveryCharge}</td>
            </tr>
        </table>
        <p>If you have any questions or concerns about your order, please don't hesitate to contact our customer service team at <a href="mailto:support@samairafashion.com">support@samairafashion.com</a>.</p>
        <a href="https://samairafashion.com/#/orders" class="cta-button">Track Your Order</a>
        <p>Thank you for choosing Samaira Fashion. We appreciate your business!</p>
        <p>Best regards,<br>Samaira Fashion Team</p>
    </div>
</body>
</html>
    `
}

export const orderConfirmationTemplateAdmin = async (orderDetails) => {

    let data = ``;
    let sum = 0;
    let quantity = 0;
    let discount = 0;
    let deliveryCharge = 0;

    const response = await axios.get('https://www.floatrates.com/daily/aed.json');
    const dirham_to_rupees = Math.round(response.data.inr.rate);
    const isIndia = orderDetails.shippingDetails.country == 'India' ? true : false;

    for (let i = 0; i < orderDetails.products.length; i++) {

        const product = orderDetails.products[i];

        sum += product.price * orderDetails.cart[i].quantity;
        quantity += orderDetails.cart[i].quantity;
        data += `
        <tr>
                <td>${product.title}</td>
                <td>${orderDetails.cart[i].quantity}</td>
                <td>${isIndia ? product.price * orderDetails.cart[i].quantity : Math.floor(product.price * orderDetails.cart[i].quantity / dirham_to_rupees)}</td>
            </tr>
            `
    }

    if(quantity > 5) {
        discount = Math.floor(sum * 0.15);
    }
    else if(quantity > 2) {
        discount = Math.floor(sum * 0.1);
    }

    const country = orderDetails.shippingDetails.country;
    if(country.includes('United Arab Emirates')) {
        if(country.includes('Dubai') || country.includes('Shar') || country.includes('Ajman')){
            deliveryCharge = 0;
        } else {
            deliveryCharge = Math.floor(20 * dirham_to_rupees);
        }
    } else if(country.includes('India')) {
        deliveryCharge = 0;
    } else {
        deliveryCharge = Math.floor(70 * dirham_to_rupees);
    }

    if(!isIndia) {
        sum = Math.floor(sum / dirham_to_rupees);
        discount = Math.floor(discount / dirham_to_rupees);
        deliveryCharge = Math.floor(deliveryCharge / dirham_to_rupees);
    }

    if(deliveryCharge > 0) {
        data += `
                    <tr class="total">
                <td colspan="2">Delivery</td>
                <td>${deliveryCharge}</td>
            </tr>
        `
    }

    if(discount > 0) {
        data += `
                    <tr class="total">
                <td colspan="2">Discount</td>
                <td>${discount}</td>
            </tr>
        `
    }

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .order-number {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            font-weight: bold;
        }
        .cta-button {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello Admin!</h2>
        <p>A new order from ${orderDetails.shippingDetails.firstName + ' ' + orderDetails.shippingDetails.lastName},</p>
        <p>We're excited to confirm that your order has been received and is being processed. Here are the details of your purchase:</p>
        <p class="order-number">Order Number: #SF0${orderDetails._id.toString().slice(5, 10)}</p>
        <table>
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price${isIndia ? '(Rs)' : '(AED)'}</th>
            </tr>
            ${data}
            <tr class="total">
                <td colspan="2">Total</td>
                <td>${sum - discount + deliveryCharge}</td>
            </tr>
        </table>
        <h3>Shipping Details</h3>
        <p>${orderDetails.shippingDetails.number}</p>
        <p>${orderDetails.shippingDetails.address}</p>
        <p>${orderDetails.shippingDetails.country}</p>
        <p>Best regards,<br>Samaira Fashion Team</p>
    </div>
</body>
</html>
    `
}