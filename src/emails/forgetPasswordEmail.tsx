import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  token: string;
}

export default function ForgetPasswordEmail({
  username,
  token,
}: VerificationEmailProps) {
  const link = process.env.RESET_PASSWORD + "/" + token;
  // console.log("LINK " + link);
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Forget Password </title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your forget password link: {link}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>Click on the following link to reset your password:</Text>
        </Row>
        <Row>
          <a href={link}>{link}</a>
        </Row>
      </Section>
    </Html>
  );
}
