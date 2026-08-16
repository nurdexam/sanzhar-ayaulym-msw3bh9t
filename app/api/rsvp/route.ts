import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const {
      clientEmail,
      name,
      guests,
      attending,
    } = await req.json();

    console.log("RSVP:", {
      clientEmail,
      name,
      guests,
      attending,
    });

    if (!clientEmail || !name || !guests) {
      return Response.json(
        {
          success: false,
          error: "Данные не заполнены",
        },
        { status: 400 }
      );
    }

    const mail = await transporter.sendMail({
      from: `"Neuroshaqyrtu" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: `💌 Жаңа қонақ: ${name}`,

      text: `
Жаңа қонақтың жауабы

Аты-жөні: ${name}
Қонақтар саны: ${guests}
Жауабы: ${attending ? "Иә, келемін" : "Келе алмаймын"}
      `.trim(),

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background: #ffffff;
            color: #222222;
          "
        >
          <h2>💌 Жаңа қонақтың жауабы</h2>

          <p>
            <strong>Аты-жөні:</strong>
            ${name}
          </p>

          <p>
            <strong>Қонақтар саны:</strong>
            ${guests}
          </p>

          <p>
            <strong>Жауабы:</strong>
            ${
              attending
                ? "✅ Иә, келемін"
                : "❌ Келе алмаймын"
            }
          </p>
        </div>
      `,
    });

    console.log("GMAIL SUCCESS:", mail.messageId);

    return Response.json({
      success: true,
      id: mail.messageId,
    });
  } catch (error) {
    console.error("GMAIL ERROR:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}