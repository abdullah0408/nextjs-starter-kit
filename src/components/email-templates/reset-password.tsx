import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  resetUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

export const ResetPasswordEmail = ({ resetUrl }: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Reset your password</Preview>
      <Container style={container}>
        <Heading style={h1}>Reset Your Password</Heading>
        <Link
          href={resetUrl}
          target="_blank"
          style={{
            ...link,
            display: "block",
            marginBottom: "16px",
          }}
        >
          Click here to reset your password
        </Link>
        <Text style={{ ...text, marginBottom: "14px" }}>
          Or, copy and paste this reset URL:
        </Text>
        <Text style={url}>{resetUrl}</Text>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          If you didn&apos;t request a password reset, you can safely ignore
          this email.
        </Text>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "12px",
            marginBottom: "38px",
          }}
        >
          For security reasons, this link will expire in 24 hours.
        </Text>
        {/* <Img
          src={`${baseUrl}/logo.png`}
          width="32"
          height="32"
          alt="NextJS Starter Kit Logo"
        /> */}
        <Text style={footer}>
          <Link
            href={baseUrl}
            target="_blank"
            style={{ ...link, color: "#898989" }}
          >
            NextJS Starter Kit
          </Link>
          , your starting point for modern web applications.
          <br />
          Built with Next.js, TypeScript, and more.
        </Text>
      </Container>
    </Body>
  </Html>
);

ResetPasswordEmail.PreviewProps = {
  resetUrl: "https://example.com/reset-password?token=abc123",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const url = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
  fontFamily: "monospace",
  fontSize: "14px",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};
