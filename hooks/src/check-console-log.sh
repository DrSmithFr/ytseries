#!/bin/bash

# Read user input, assign stdin to keyboard
exec < /dev/tty

consoleregexp='console.log'
found=0

for FILE in $*
do
    EXT="${FILE##*.}"

    if [[ "$EXT" != "ts" && "$EXT" != "js" ]]
    then
        continue
    fi

    if test $(git diff --cached HEAD ${FILE} | grep "$consoleregexp[(]" | wc -l) != 0
    then
        echo ""
        git diff --cached HEAD ${FILE} | grep --color=auto -C 2 -ne "$consoleregexp[(]"

        echo -e "\nThere are some occurrences of \e[1;31mconsole.log()\e[0m in \e[33m$FILE\e[0m."

        ./hooks/bin/ask.sh ask_simple \
            "Are you sure want to continue?" \
            "\n\t\e[31mAborting commit.\e[0m\n"

        if [[ $? -eq 0 ]]
        then
            found=$((found+1))
        else
            exit 1
        fi
    fi
done

if [[ ${found} -eq 0 ]]
then
    echo -e " \e[42;30m[DONE]\e[0m \e[1;30mNo console.log found\e[0m"
else
    echo -e " \e[33mWARNING: console.log were ignored and added to commit.\e[0m"
fi
