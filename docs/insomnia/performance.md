# Performance Tips

These tips exists to help you achieve the optimum client-side performance when using the **Insomnia: Hardcore** modpack.
1. Allocate the recommended amount of dedicated RAM *(You will be notified when launching the modpack of the ideal amount for your machine)*.
2. Install and use GraalVM 17 (Faster Java): [[GraalVM 17 download]](https://www.oracle.com/java/technologies/javase/graalvm-jdk17-archive-downloads.html)
3. Use one of the optimized Java arguments found below that matches your Java distribution.

The biggest offender to performance in this pack is terrain generation. For the best client performance, it is greatly recommended to either pregenerate the terrain before playing or play on a dedicated server. 

::: tip Bisect Hosting
Save 25% off your first month when getting a dedicated server using our code "**CRISM**".

[Get a dedicated server](https://bisecthosting.com/CRISM)
:::

## Optimized Java Arguments

Based on G1GC flags from: [Mukul1127/Minecraft-Java-Flags](https://github.com/Mukul1127/Minecraft-Java-Flags)

#### GraalVM

``` batch
-XX:+UnlockExperimentalVMOptions -XX:+UnlockDiagnosticVMOptions -XX:+AlwaysActAsServerClassMachine -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:NmethodSweepActivity=1 -XX:ReservedCodeCacheSize=400M -XX:NonNMethodCodeHeapSize=12M -XX:ProfiledCodeHeapSize=194M -XX:NonProfiledCodeHeapSize=194M -XX:-DontCompileHugeMethods -XX:+PerfDisableSharedMem -XX:+UseFastUnorderedTimeStamps -XX:+UseCriticalJavaThreadPriority -XX:+EagerJVMCI -Dgraal.TuneInlinerExploration=1 -XX:+UseG1GC -XX:MaxGCPauseMillis=37 -XX:+PerfDisableSharedMem -XX:G1HeapRegionSize=16M -XX:G1NewSizePercent=23 -XX:G1ReservePercent=20 -XX:SurvivorRatio=32 -XX:G1MixedGCCountTarget=3 -XX:G1HeapWastePercent=20 -XX:InitiatingHeapOccupancyPercent=10 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:MaxTenuringThreshold=1 -XX:G1SATBBufferEnqueueingThresholdPercent=30 -XX:G1ConcMarkStepDurationMillis=5.0 -XX:GCTimeRatio=99 -XX:G1ConcRefinementServiceIntervalMillis=150 -XX:G1ConcRSHotCardLimit=16 -XX:AllocatePrefetchStyle=3
```

#### Regular Java
Take these arguments if not using GraalVM.

``` batch
-XX:+UnlockExperimentalVMOptions -XX:+UnlockDiagnosticVMOptions -XX:+AlwaysActAsServerClassMachine -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:NmethodSweepActivity=1 -XX:ReservedCodeCacheSize=400M -XX:NonNMethodCodeHeapSize=12M -XX:ProfiledCodeHeapSize=194M -XX:NonProfiledCodeHeapSize=194M -XX:-DontCompileHugeMethods -XX:MaxNodeLimit=240000 -XX:NodeLimitFudgeFactor=8000 -XX:+UseVectorCmov -XX:+PerfDisableSharedMem -XX:+UseFastUnorderedTimeStamps -XX:+UseCriticalJavaThreadPriority -XX:ThreadPriorityPolicy=1 -XX:+UseG1GC -XX:MaxGCPauseMillis=37 -XX:+PerfDisableSharedMem -XX:G1HeapRegionSize=16M -XX:G1NewSizePercent=23 -XX:G1ReservePercent=20 -XX:SurvivorRatio=32 -XX:G1MixedGCCountTarget=3 -XX:G1HeapWastePercent=20 -XX:InitiatingHeapOccupancyPercent=10 -XX:G1RSetUpdatingPauseTimePercent=0 -XX:MaxTenuringThreshold=1 -XX:G1SATBBufferEnqueueingThresholdPercent=30 -XX:G1ConcMarkStepDurationMillis=5.0 -XX:GCTimeRatio=99 -XX:G1ConcRefinementServiceIntervalMillis=150 -XX:G1ConcRSHotCardLimit=16 -XX:AllocatePrefetchStyle=3
```



## Where do i change this stuff?

#### CurseForge Launcher
Click the cogwheel in the bottom left corner, select Minecraft and scroll down to the "Java Settings" section. Here you wanna select the directory for where you installed GraalVM 17 and add the Java flags in the "Additional Arguments" field.

![IMG](https://raw.githubusercontent.com/CrismPack/CDN/refs/heads/main/desc/insomnia/performance-tips/cf-java-settings.png)
