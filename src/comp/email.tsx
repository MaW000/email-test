import * as React from "react";

interface EmailTemplateProps {
  token: string;
  name: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  token,
  name,
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <a href={token}>Click here to get verified!</a>
  </div>
);
