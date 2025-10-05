interface WelcomeEmailProps {
  firstName: string;
  companyName?: string;
  loginUrl?: string;
}

export function WelcomeEmail({
  firstName,
  companyName = "YourApp",
  loginUrl = "https://yourapp.com/login",
}: WelcomeEmailProps) {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        lineHeight: "1.6",
        color: "#333333",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#4f46e5",
          padding: "40px 30px",
          textAlign: "center" as const,
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            margin: "0",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          Welcome to {companyName}! 🎉
        </h1>
      </div>

      {/* Main Content */}
      <div
        style={{
          padding: "40px 30px",
        }}
      >
        <h2
          style={{
            color: "#1f2937",
            fontSize: "24px",
            marginBottom: "20px",
            fontWeight: "600",
          }}
        >
          Hi {firstName}! 👋
        </h2>

        <p
          style={{
            fontSize: "16px",
            marginBottom: "20px",
            color: "#4b5563",
          }}
        >
          We&apos;re thrilled to have you join our community! Your account has
          been successfully created and you&apos;re all set to get started.
        </p>

        <div
          style={{
            backgroundColor: "#f8fafc",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <h3
            style={{
              color: "#1f2937",
              fontSize: "18px",
              marginBottom: "15px",
              marginTop: "0",
            }}
          >
            🚀 What&apos;s next?
          </h3>
          <ul
            style={{
              margin: "0",
              paddingLeft: "20px",
              color: "#4b5563",
            }}
          >
            <li style={{ marginBottom: "8px" }}>Complete your profile setup</li>
            <li style={{ marginBottom: "8px" }}>
              Explore our features and tools
            </li>
            <li style={{ marginBottom: "8px" }}>Connect with other users</li>
            <li>Start building something amazing!</li>
          </ul>
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: "center" as const, marginBottom: "30px" }}>
          <a
            href={loginUrl}
            style={{
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              padding: "14px 28px",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              display: "inline-block",
              boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
            }}
          >
            Get Started Now
          </a>
        </div>

        <p
          style={{
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "20px",
          }}
        >
          If you have any questions, feel free to reach out to our support team.
          We&apos;re here to help!
        </p>

        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "20px",
            marginTop: "30px",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              color: "#1f2937",
              marginBottom: "5px",
            }}
          >
            Best regards,
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#4f46e5",
              fontWeight: "600",
              margin: "0",
            }}
          >
            The {companyName} Team
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "30px",
          textAlign: "center" as const,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            margin: "0 0 10px 0",
          }}
        >
          © 2025 {companyName}. All rights reserved.
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            margin: "0",
          }}
        >
          You received this email because you signed up for {companyName}.
        </p>
      </div>
    </div>
  );
}
