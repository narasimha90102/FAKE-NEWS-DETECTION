# React Native ProGuard Rules
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <fields>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <fields>;
}

# Keep OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }

# Keep React Native SVG
-keep class com.horcrux.svg.** { *; }
