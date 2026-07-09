const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const DockSharkAnchorModule = buildModule("DockSharkAnchorModule", (m) => {
  const dockSharkAnchor = m.contract("DockSharkAnchor");
  return { dockSharkAnchor };
});

module.exports = DockSharkAnchorModule;
