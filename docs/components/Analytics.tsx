import React from "react";

export default function Analytics() {
  const url = process.env.UMAMI_URL;
  const id = process.env.UMAMI_ID;
  if (url) {
    return (
      <>
        <script async defer data-website-id={id || ""} src={url} />
      </>
    );
  }
  return <></>;
}
