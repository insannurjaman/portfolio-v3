import React from "react";
import "./saphyte-eafghans.css";

export function CoreFoundationEvidence() {
  return <div className="core-foundation-evidence">
    <div className="system-token-table"><table><caption>Source fill relationship in the reviewed solid buttons</caption><thead><tr><th scope="col">Product</th><th scope="col">Component fill role</th><th scope="col">Global primitive</th></tr></thead><tbody>
      <tr><th scope="row">Saphyte</th><td><code>brand/saphyte/solid</code></td><td><code>brand/saphyte/600</code></td></tr>
      <tr><th scope="row">E-Afghans</th><td><code>brand/eafghan-1/solid</code></td><td><code>brand/eafghan-1/600</code></td></tr>
    </tbody></table></div>
    <p>These solid roles resolve to the same listed primitive in both source color modes. Other roles, such as foreground and subtle surfaces, change their referenced shade between light and dark.</p>
    <div className="system-token-table"><table><caption>Source typography modes</caption><thead><tr><th scope="col">Mode</th><th scope="col">Heading family</th><th scope="col">Body family</th></tr></thead><tbody>
      <tr><th scope="row">Inter</th><td>Inter</td><td>Inter</td></tr>
      <tr><th scope="row">Geist</th><td>Geist</td><td>Geist</td></tr>
      <tr><th scope="row">Eafghans</th><td>NewsReader</td><td>Inter</td></tr>
    </tbody></table></div>
  </div>;
}
