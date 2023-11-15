import { useRouter } from "next/router";

import { Layout } from "components/account";
import { alertService, userService } from "services";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export default Login;

function Login() {
  const router = useRouter();
  const [url, setURL] = useState("https://placehold.co/256");
  const [regen, setRegen] = useState(false);

  const name = userService.user.firstName;
  const identity = userService.user.id;

  console.log(userService.user);

  useEffect(() => {
    if (!userService.user.authenticate && regen) {
      handleCreateFactor();
    }
  }, [regen]);

  function handleCreateFactor() {
    alertService.clear();
    return userService
      .createFactor(name, identity)
      .then((data) => {
        setURL(data.uri);
        alertService.success("QR Code Generated", true);
        router.push("/");
      })
      .catch(alertService.error)
      .finally(() => {
        // Reset regen to false after performing actions
        setRegen(false);
      });
  }

  function handleSubmit() {
    alertService.clear();
    router.push("code");
  }

  function handleRegenerate() {
    setRegen((prevRegen) => !prevRegen);
  }

  return (
    <Layout>
      <div className="card">
        <h4 className="card-header">Scan or Register Key</h4>
        <div className="card-body">
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 200,
              width: "100%",
            }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={url}
              viewBox={`0 0 256 256`}
            />
          </div>

          <div
            style={{
              margin: "30px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button className="btn btn-primary" onClick={handleSubmit}>
              Continue
            </button>
            <button className="btn btn-primary" onClick={handleRegenerate}>
              Generate/Regenerate QR Code
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
