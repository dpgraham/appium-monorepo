#!/bin/sh
set -e
mocha_args=""
ios_only=false
ios6_only=false
ios7_only=false
ios71_only=false
ios8_only=false
ios81_only=false
android_only=false
android_chrome=false
selendroid_only=false
gappium_only=false
real_device=false
all_tests=true
xcode_switch=true
xcode_path=""
if command -v xcode-select 2>/dev/null; then
    xcode_path="$(xcode-select -print-path | sed s/\\/Contents\\/Developer//g)"
fi
did_switch_xcode=false

for arg in "$@"; do
    if [ "$arg" = "--ios" ]; then
        ios_only=true
        all_tests=false
    elif [ "$arg" = "--android" ]; then
        android_only=true
        all_tests=false
    elif [ "$arg" = "--android-chrome" ]; then
        android_chrome=true
        all_tests=false
    elif [ "$arg" = "--selendroid" ]; then
        selendroid_only=true
        all_tests=false
    elif [ "$arg" = "--gappium" ]; then
        gappium_only=true
        all_tests=false
    elif [ "$arg" = "--ios6" ]; then
        ios6_only=true
        all_tests=false
    elif [ "$arg" = "--ios7" ]; then
        ios7_only=true
        all_tests=false
    elif [ "$arg" = "--ios71" ]; then
        ios71_only=true
        all_tests=false
    elif [ "$arg" = "--ios8" ]; then
        ios8_only=true
        all_tests=false
    elif [ "$arg" = "--ios81" ]; then
        ios81_only=true
        all_tests=false
    elif [ "$arg" = "--no-xcode-switch" ]; then
        xcode_switch=false
    elif [ "$arg" = "--real-device" ]; then
        real_device=true
    elif [ "$arg" =~ " " ]; then
        mocha_args="$mocha_args \"$arg\""
    else
        mocha_args="$mocha_args $arg"
    fi
done

appium_mocha="./node_modules/.bin/mocha --recursive $mocha_args"

run_ios_tests() {
    echo "RUNNING IOS $1 TESTS"
    echo "---------------------"


    if $xcode_switch; then
        if test -d /Applications/Xcode-$1.app; then
            echo "Found Xcode for iOS $1, switching to it"
            sudo xcode-select -switch /Applications/Xcode-$1.app
            did_switch_xcode=true
        else
            echo "Did not find /Applications/Xcode-$1.app, using default"
        fi
    fi
    DEVICE=$2 time $appium_mocha -g $3 -i \
        test/functional/common \
        test/functional/ios
}

if $ios6_only || $ios_only || $all_tests; then
    run_ios_tests "6.1" "ios6" "@skip-ios6|@skip-ios-all"
fi

if $ios7_only || $all_tests; then
    run_ios_tests "7.0" "ios7" "@skip-ios7|@skip-ios-all"
fi

if $ios71_only || $all_tests; then
    run_ios_tests "7.1" "ios71" "@skip-ios71|@skip-ios7|@skip-ios-all|@skip-ios7up"
fi

if $ios8_only || $all_tests; then
    run_ios_tests "8.0" "ios8" "@skip-ios8|@skip-ios-all|@skip-ios7up"
fi

if $ios81_only || $all_tests; then
    run_ios_tests "8.1" "ios81" "@skip-ios81|@skip-ios8|@skip-ios-all|@skip-ios7up"
fi

if $did_switch_xcode; then
    echo "Switching back to default Xcode ($xcode_path)"
    sudo xcode-select -switch $xcode_path
fi

if $android_only || $all_tests; then
    echo "RUNNING ANDROID TESTS"
    echo "---------------------"

    if $real_device; then
        DEVICE=android REAL_DEVICE=true time $appium_mocha \
            -g  '@skip-android-all|@android-arm-only|@skip-real-device' -i \
            test/functional/common \
            test/functional/android
    else
        DEVICE=android time $appium_mocha \
            -g  '@skip-android-all|@android-arm-only' -i \
            test/functional/common \
            test/functional/android
    fi
fi

if $android_chrome; then
    echo "RUNNING ANDROID CHROME TESTS"
    echo "---------------------"

    if $real_device; then
        DEVICE=android REAL_DEVICE=true time $appium_mocha \
            -g  '@skip-chrome|@skip-android-all' -i \
            test/functional/android/chrome
    else
        DEVICE=android time $appium_mocha \
            -g  '@skip-chrome|@skip-android-all' -i \
            test/functional/android/chrome
    fi
fi

if $selendroid_only || $all_tests; then
    echo "RUNNING SELENDROID TESTS"
    echo "---------------------"
    DEVICE=selendroid time $appium_mocha -g  '@skip-selendroid-all' -i \
        test/functional/selendroid
fi

if $gappium_only || $all_tests; then
    echo "RUNNING GAPPIUM TESTS"
    echo "---------------------"
    DEVICE=ios71 time $appium_mocha test/functional/gappium
    # disabling, ios6 not working yet xcode 6
    #DEVICE=ios6 time $appium_mocha test/functional/gappium
    echo "Start the android emulator api 19 and press Enter."
    read
    DEVICE=android time $appium_mocha test/functional/gappium
    # disabling gappium test, see https://github.com/selendroid/selendroid/issues/658
    #echo "Start the android emulator api 16 and press Enter."
    #read
    #DEVICE=selendroid time $appium_mocha test/functional/gappium
fi
