const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"quickBuzz" <nayeem5113a@gmail.com>',
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

const sendProductStatusEmail = async (hostEmail, hostName, productTitle, status) => {
    const isApproved = status === "approve" || status === "APPROVED";
    const subject = isApproved ? "Your product has been approved! 🎉" : "Product listing status update";
    const statusText = isApproved ? "approved and is now live on quickBuzz." : "rejected/declined.";
    const statusColor = isApproved ? "#22c55e" : "#ef4444";

    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; border: 1px solid #f3f4f6; border-radius: 16px; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #f97316; margin: 0; font-size: 28px; font-weight: 800;">quickBuzz</h1>
            </div>
            <div style="border-top: 4px solid #f97316; padding-top: 20px;">
                <p style="font-size: 16px; color: #1f2937;">Hello <strong>${hostName || "Host"}</strong>,</p>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                    We wanted to let you know that your product listing <strong>"${productTitle}"</strong> has been:
                </p>
                <div style="background-color: #f9fafb; border-left: 4px solid ${statusColor}; padding: 12px 20px; margin: 15px 0; border-radius: 4px;">
                    <span style="font-weight: 700; color: ${statusColor}; text-transform: uppercase; font-size: 14px;">${statusText}</span>
                </div>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                    ${isApproved ? "Customers can now view and purchase your product on our catalog!" : "If you have any questions, feel free to contact platform support."}
                </p>
                <p style="margin-top: 25px; font-size: 15px; color: #4b5563;">Best regards,<br/>The quickBuzz Team</p>
            </div>
            <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
                This is an automated notification. Please do not reply directly to this email.
            </div>
        </div>
    `;

    return sendMail({ to: hostEmail, subject, html });
};

const sendOrderConfirmationEmail = async (userEmail, userName, orderId, totalAmount, paymentMethod) => {
    const subject = "Your quickBuzz order has been placed! 🛍️";
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; border: 1px solid #f3f4f6; border-radius: 16px; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #f97316; margin: 0; font-size: 28px; font-weight: 800;">quickBuzz</h1>
            </div>
            <div style="border-top: 4px solid #f97316; padding-top: 20px;">
                <p style="font-size: 16px; color: #1f2937;">Hello <strong>${userName || "Customer"}</strong>,</p>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                    Thank you for your order! We are preparing it for you.
                </p>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid #f3f4f6;">
                    <h3 style="margin-top: 0; color: #1f2937; font-size: 16px;">Order Summary</h3>
                    <p style="margin: 5px 0; font-size: 14px; color: #4b5563;"><strong>Order ID:</strong> #${orderId}</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #4b5563;"><strong>Total Amount:</strong> ৳${totalAmount.toLocaleString()}</p>
                    <p style="margin: 5px 0; font-size: 14px; color: #4b5563;"><strong>Payment Method:</strong> ${paymentMethod}</p>
                </div>
                <p style="margin-top: 25px; font-size: 15px; color: #4b5563;">Best regards,<br/>The quickBuzz Team</p>
            </div>
            <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
                This is an automated notification. Please do not reply directly to this email.
            </div>
        </div>
    `;

    return sendMail({ to: userEmail, subject, html });
};

const sendOrderStatusEmail = async (userEmail, userName, orderId, status) => {
    const subject = `Order #${String(orderId).slice(-8)} Status Update: ${status.toUpperCase()}`;
    const statusColors = {
        pending: "#f59e0b",
        processing: "#3b82f6",
        shipped: "#8b5cf6",
        delivered: "#10b981",
        cancelled: "#ef4444"
    };
    const statusColor = statusColors[status.toLowerCase()] || "#f97316";

    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; border: 1px solid #f3f4f6; border-radius: 16px; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #f97316; margin: 0; font-size: 28px; font-weight: 800;">quickBuzz</h1>
            </div>
            <div style="border-top: 4px solid #f97316; padding-top: 20px;">
                <p style="font-size: 16px; color: #1f2937;">Hello <strong>${userName || "Customer"}</strong>,</p>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                    Your order status has been updated:
                </p>
                <div style="background-color: #f9fafb; border-left: 4px solid ${statusColor}; padding: 12px 20px; margin: 15px 0; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>Order ID:</strong> #${orderId}</p>
                    <p style="margin: 5px 0 0 0; font-size: 14px; color: #4b5563;"><strong>Status:</strong> <span style="font-weight: 700; color: ${statusColor}; text-transform: uppercase;">${status}</span></p>
                </div>
                <p style="margin-top: 25px; font-size: 15px; color: #4b5563;">Best regards,<br/>The quickBuzz Team</p>
            </div>
            <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
                This is an automated notification. Please do not reply directly to this email.
            </div>
        </div>
    `;

    return sendMail({ to: userEmail, subject, html });
};

const sendSellerStatusEmail = async (sellerEmail, sellerName, status, reason = "") => {
    const isApproved = status === "approve" || status === "APPROVED" || status === "Approved";
    const subject = isApproved ? "Your Seller Application has been approved! 🎉" : "Update on your Seller Application";
    const statusText = isApproved ? "approved! You can now list and sell products on quickBuzz." : `declined.${reason ? ` Reason: ${reason}` : ""}`;
    const statusColor = isApproved ? "#22c55e" : "#ef4444";

    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; border: 1px solid #f3f4f6; border-radius: 16px; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #f97316; margin: 0; font-size: 28px; font-weight: 800;">quickBuzz</h1>
            </div>
            <div style="border-top: 4px solid #f97316; padding-top: 20px;">
                <p style="font-size: 16px; color: #1f2937;">Hello <strong>${sellerName || "Seller"}</strong>,</p>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                    We wanted to inform you that your application to become a seller on quickBuzz has been:
                </p>
                <div style="background-color: #f9fafb; border-left: 4px solid ${statusColor}; padding: 12px 20px; margin: 15px 0; border-radius: 4px;">
                    <span style="font-weight: 700; color: ${statusColor}; text-transform: uppercase; font-size: 14px;">${isApproved ? "Approved" : "Declined"}</span>
                    ${!isApproved && reason ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #4b5563;">Reason: ${reason}</p>` : ""}
                </div>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                    ${isApproved ? "You can now log into your dashboard and navigate to list products." : "If you wish to re-apply, please resolve the issues specified above and submit a new request."}
                </p>
                <p style="margin-top: 25px; font-size: 15px; color: #4b5563;">Best regards,<br/>The quickBuzz Team</p>
            </div>
            <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
                This is an automated notification. Please do not reply directly to this email.
            </div>
        </div>
    `;

    return sendMail({ to: sellerEmail, subject, html });
};

module.exports = {
    sendMail,
    sendProductStatusEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusEmail,
    sendSellerStatusEmail
};
