/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

const models = require('./index');

/**
 * Class representing a LogFlowLog.
 */
class LogFlowLog {
  /**
   * Create a LogFlowLog.
   * @member {date} timestamp Log creation timestamp.
   * @member {uuid} installId Install ID.
   * @member {object} device
   * @member {string} [device.sdkName] Name of the SDK. Consists of the name of
   * the SDK and the platform, e.g. "appcenter.ios", "hockeysdk.android".
   * @member {string} [device.sdkVersion] Version of the SDK in semver format,
   * e.g. "1.2.0" or "0.12.3-alpha.1".
   * @member {string} [device.wrapperSdkVersion] Version of the wrapper SDK in
   * semver format. When the SDK is embedding another base SDK (for example
   * Xamarin.Android wraps Android), the Xamarin specific version is populated
   * into this field while sdkVersion refers to the original Android SDK.
   * @member {string} [device.wrapperSdkName] Name of the wrapper SDK. Consists
   * of the name of the SDK and the wrapper platform, e.g. "appcenter.xamarin",
   * "hockeysdk.cordova".
   * @member {string} [device.model] Device model (example: iPad2,3).
   * @member {string} [device.oemName] Device manufacturer (example: HTC).
   * @member {string} [device.osName] OS name (example: iOS). The following OS
   * names are standardized (non-exclusive): Android, iOS, macOS, tvOS,
   * Windows.
   * @member {string} [device.osVersion] OS version (example: 9.3.0).
   * @member {string} [device.osBuild] OS build code (example: LMY47X).
   * @member {number} [device.osApiLevel] API level when applicable like in
   * Android (example: 15).
   * @member {string} [device.locale] Language code (example: en_US).
   * @member {number} [device.timeZoneOffset] The offset in minutes from UTC
   * for the device time zone, including daylight savings time.
   * @member {string} [device.screenSize] Screen size of the device in pixels
   * (example: 640x480).
   * @member {string} [device.appVersion] Application version name, e.g. 1.1.0
   * @member {string} [device.carrierName] Carrier name (for mobile devices).
   * @member {string} [device.carrierCode] Carrier country code (for mobile
   * devices).
   * @member {string} [device.carrierCountry] Carrier country.
   * @member {string} [device.appBuild] The app's build number, e.g. 42.
   * @member {string} [device.appNamespace] The bundle identifier, package
   * identifier, or namespace, depending on what the individual plattforms use,
   * .e.g com.microsoft.example.
   * @member {string} [device.liveUpdateReleaseLabel] Label that is used to
   * identify application code 'version' released via Live Update beacon
   * running on device
   * @member {string} [device.liveUpdateDeploymentKey] Identifier of
   * environment that current application release belongs to, deployment key
   * then maps to environment like Production, Staging.
   * @member {string} [device.liveUpdatePackageHash] Hash of all files
   * (ReactNative or Cordova) deployed to device via LiveUpdate beacon. Helps
   * identify the Release version on device or need to download updates in
   * future.
   * @member {string} [device.wrapperRuntimeVersion] Version of the wrapper
   * technology framework (Xamarin runtime version or ReactNative or Cordova
   * etc...). See wrapper_sdk_name to see if this version refers to Xamarin or
   * ReactNative or other.
   * @member {string} type Polymorphic Discriminator
   */
  constructor() {
  }

  /**
   * Defines the metadata of LogFlowLog
   *
   * @returns {object} metadata of LogFlowLog
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'LogFlowLog',
      type: {
        name: 'Composite',
        polymorphicDiscriminator: {
          serializedName: 'type',
          clientName: 'type'
        },
        uberParent: 'LogFlowLog',
        className: 'LogFlowLog',
        modelProperties: {
          timestamp: {
            required: true,
            serializedName: 'timestamp',
            type: {
              name: 'DateTime'
            }
          },
          installId: {
            required: true,
            serializedName: 'install_id',
            type: {
              name: 'String'
            }
          },
          device: {
            required: true,
            serializedName: 'device',
            type: {
              name: 'Composite',
              className: 'LogFlowDevice'
            }
          },
          type: {
            required: true,
            serializedName: 'type',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = LogFlowLog;
