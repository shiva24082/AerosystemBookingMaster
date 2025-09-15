# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# Add project specific ProGuard rules here.
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# For react-native-vector-icons
-keep class com.github.** { *; }

# For react-native-maps
-keep class com.google.** { *; }
-keep class com.airbnb.** { *; }

# For Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
