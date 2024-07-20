const resetPasswordEmail = ({
  token,
  username,
}: {
  token: string;
  username: string;
}) => {
  return `<div>
  <div>
  </div>
  <div>
    <h2>Hello ${username},</h2>
    <p>
      Here is your reset password Token
    </p>
  </div>
  <Button type='submit' variant='link'>
  <a href="${`${process.env.DOMAIN}/reset-password?token=${token}`}">Click Here</a>
  </Button>
  <br />
  to reset your password
  or copy and paste the link below in your browser. <br/> ${`${process.env.DOMAIN}/reset-password?token=${token}`}
<div>
  <p>If you did not request this code, please ignore this email.</p>
</div>
</div>`;
};

export default resetPasswordEmail;
