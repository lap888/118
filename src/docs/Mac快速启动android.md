## emulator -list-avds
启动的步骤
1、使用命令查看本机中带的模拟器

emulator -list-avds
# Nexus_5X_API_28(我本机上模拟器)
1
2
2、进入tools文件夹下新增emu.sh文件

/Users/[username]/Library/Android/sdk/tools # [username]是你电脑名
1
3、emu.sh文件内容

pushd ${ANDROID_HOME}/tools
emulator -avd 本机的模拟器
popd
1
2
3
4、在.bash_profile环境变量中配置

export ANDROID_SDK_ROOT=/Users/shuiping.kuang/Library/Android/sdk
export PATH=$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/tools:$PATH
1
2
5、刷新环境变量

source .bash_profile
1
6、运行命令启动模拟器

emu.sh
1
7、如果遇到没权限执行的时候

chmod +x 文件