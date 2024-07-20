const VerificationEmail = ({
  username,
  otp,
}: {
  username: string; 
  otp: string;
}) => {
  return (
    `
    <html lang="en" dir="ltr">
      <section>
        <div>
          <h2>Hello ${username},</h2>
          <p>Here&apos;s your verification code: ${otp}.</p>
          <p>This code will be valid only for 1 hour</p>
        </div>
        <div>
          <p>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </p>
        </div>
        <div>
          <p>${otp}</p>
        </div>
        <div>
          <p>Note that we have blocked this username so that other can't use this till the time your code is not expired.
          Once the code is expired then this username will be available for anyone.
          Thank you.
          </p>
        </div>
        <div>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
        <div>
        Team Mystery Message
        </div>
      </section>
    </html>`
  );
};

export default VerificationEmail;