{
  description = "My cordova environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-22.05";
    flake-utils = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:numtide/flake-utils";
    };
    android-nixpkgs = {
      url = "github:tadfisher/android-nixpkgs";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, android-nixpkgs, flake-utils, ... }@inputs:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        myAndroidSDK = ( android-nixpkgs.sdk.${system} (sdkPkgs: with sdkPkgs; [
          cmdline-tools-latest
          build-tools-30-0-3
          platform-tools
          platforms-android-30
          sources-android-30
          emulator
          # see possible values using
          # `nix flake show github:tadfisher/android-nixpkgs`
          # system-images-android-30-google-apis-arm64-v8a
          # system-images-android-30-google-apis-playstore-arm64-v8a
          system-images-android-27-google-apis-playstore-x86
          system-images-android-27-google-apis-x86
        ]) );
      in
      rec {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            myAndroidSDK
            nodePackages.cordova
            jdk11
          ];

          shellHook = ''
            export JAVA_HOME=${pkgs.jdk11}/lib/openjdk/
            # export ANDROID_SDK_ROOT=~/Android/Sdk
          '';
        };
      }
    );
}
