#!/bin/bash

# BluMeet APK Build Script
echo "🔧 Starting BluMeet APK Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Success: $1${NC}"
    else
        echo -e "${RED}❌ Error: $1${NC}"
        exit 1
    fi
}

# Step 1: Check if Android assets directory exists, create if not
echo -e "${BLUE}📁 Checking assets directory...${NC}"
mkdir -p android/app/src/main/assets
check_success "Assets directory ready"

# Step 2: Bundle JS and assets
echo -e "${BLUE}📦 Bundling JavaScript and assets...${NC}"
npx react-native bundle --platform android --dev false \
    --entry-file index.js \
    --bundle-output android/app/src/main/assets/index.android.bundle \
    --assets-dest android/app/src/main/res/
check_success "JavaScript bundle created"

# Step 3: Navigate to android directory
cd android

# Step 4: Clean previous builds
echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
./gradlew clean
check_success "Clean completed"

# Step 5: Generate APK
echo -e "${BLUE}🏗️  Building release APK...${NC}"
./gradlew assembleRelease
check_success "APK build completed"

# Step 6: Check if APK was created
if [ -f app/build/outputs/apk/release/app-release.apk ]; then
    echo -e "${GREEN}✅ APK generated successfully!${NC}"
    echo -e "${YELLOW}📱 APK location: $(pwd)/app/build/outputs/apk/release/app-release.apk${NC}"
    
    # Display APK size
    APK_SIZE=$(du -h app/build/outputs/apk/release/app-release.apk | cut -f1)
    echo -e "${YELLOW}📊 APK Size: $APK_SIZE${NC}"
    
    # Step 7: Optional - Install on connected device
    if [ "$1" = "--install" ]; then
        echo -e "${BLUE}📲 Installing on connected device...${NC}"
        adb devices | grep -v "List of devices attached" | grep -v "^$" > /dev/null 2>&1
        if [ $? -eq 0 ]; then
            adb install -r app/build/outputs/apk/release/app-release.apk
            check_success "APK installed on device"
        else
            echo -e "${YELLOW}⚠️  No connected devices found. Skipping installation.${NC}"
        fi
    fi
    
    # Step 8: Optional - Generate AAB for Play Store
    if [ "$1" = "--aab" ]; then
        echo -e "${BLUE}📦 Generating Android App Bundle (AAB)...${NC}"
        ./gradlew bundleRelease
        if [ -f app/build/outputs/bundle/release/app-release.aab ]; then
            echo -e "${GREEN}✅ AAB generated successfully!${NC}"
            echo -e "${YELLOW}📦 AAB location: $(pwd)/app/build/outputs/bundle/release/app-release.aab${NC}"
        else
            echo -e "${RED}❌ AAB generation failed!${NC}"
        fi
    fi
else
    echo -e "${RED}❌ APK generation failed!${NC}"
    echo -e "${YELLOW}ℹ️  Check the build errors above and ensure you have:${NC}"
    echo -e "${YELLOW}   • Proper signing configuration${NC}"
    echo -e "${YELLOW}   • Android SDK installed${NC}"
    echo -e "${YELLOW}   • Java Development Kit (JDK) installed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Build process completed!${NC}"