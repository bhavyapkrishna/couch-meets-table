import React from "react";
import { Button } from "@/components/ui/button";

const LogInPage = () => (
  <div>
    <h1>Log In</h1>
    <input type="text" placeholder="CWRU Email" />
    <input type="password" placeholder="Password" />
    <Button className="mt-4">Log In</Button>
  </div>
);

export default LogInPage;