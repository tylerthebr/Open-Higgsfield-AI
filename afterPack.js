import { execSync } from 'child_process';
import path from 'path';

// Note: this ad-hoc signing is needed for local builds on macOS to avoid
// "app is damaged" errors when running without a paid Apple Developer cert
// See: https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution

// Personal note: added --verbose flag to get more details when signing fails,
// helpful for debugging on my M2 Mac
export default async function afterPack({ appOutDir, packager }) {
    if (packager.platform.name !== 'mac') return;

    const appPath = path.join(appOutDir, `${packager.appInfo.productName}.app`);
    console.log(`  • ad-hoc signing  path=${appPath}`);

    try {
        execSync(`codesign --deep --force --verbose --sign - "${appPath}"`, { stdio: 'inherit' });
        console.log(`  • ad-hoc signing complete`);
    } catch (err) {
        // Changed from warn to error so it's more visible in CI logs,
        // even though it's still non-fatal for local dev builds
        console.error(`  • ad-hoc signing failed (non-fatal): ${err.message}`);
    }
}
