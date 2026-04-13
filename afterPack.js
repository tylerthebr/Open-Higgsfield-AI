import { execSync } from 'child_process';
import path from 'path';

// Note: this ad-hoc signing is needed for local builds on macOS to avoid
// "app is damaged" errors when running without a paid Apple Developer cert
// See: https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution
export default async function afterPack({ appOutDir, packager }) {
    if (packager.platform.name !== 'mac') return;

    const appPath = path.join(appOutDir, `${packager.appInfo.productName}.app`);
    console.log(`  • ad-hoc signing  path=${appPath}`);

    try {
        execSync(`codesign --deep --force --sign - "${appPath}"`, { stdio: 'inherit' });
        console.log(`  • ad-hoc signing complete`);
    } catch (err) {
        console.warn(`  • ad-hoc signing failed (non-fatal): ${err.message}`);
    }
}
