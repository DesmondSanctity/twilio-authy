import { useRouter } from "next/router";

import { Layout } from "components/account";
import { alertService, userService } from "services";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";

export default Login;

function Login() {
  const router = useRouter();
  const [url, setURL] = useState("");
  const [regen, setRegen] = useState(false);

  const name = userService.userValue.user.firstName;
  const identity = userService.userValue.user.id

  console.log(userService.userValue);
  // console.log(url);

  useEffect(() => {
    if (!userService.userValue.user.authenticated && !url && regen) {
      handleCreateFactor();
    }
  }, [regen]);

  function handleCreateFactor() {
    alertService.clear();
    return userService
      .createFactor(name, identity)
      .then((data) => {
        console.log("data", data);
        setURL(data.binding.uri);
        alertService.success("QR Code Generated", true);
        // router.push("/");
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
          {url ? (
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
          ) : (
            <p>The get the QR Code, click the regenerate button.</p>
          )}
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
