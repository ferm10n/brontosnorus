import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";

if (Deno.args[0] === '--help') {
    console.log(`USAGE: deno run --allow-run main.ts [checkMinutes=5] [triggerMinutes=15]`);
    Deno.exit(0);
}

// get args
const checkMinutes = parseInt(Deno.args[0] || '5');
const triggerMinutes = parseInt(Deno.args[1] || '15');

/** the last time an active user on ssh was seen */
let lastSeen = new Date();

async function main () {
    // get all processes that might be an ssh login
    const ps = (await exec('ps auxwww', { output: OutputMode.Capture })).output;

    // filter only ssh processes through
    const sshs = ps.split('\n').filter(p => {
        const [ user ] = p.match(/^\S+/) || []; // get first word of output
        return user !== 'root' && p.match(' sshd: '); //  include process if it mentions sshd
    });

    if (sshs.length === 0) { // if no users sshed in
        const msSinceLastUser: number = new Date().getTime() - lastSeen.getTime(); // compute time difference
        const minutesSinceLastUserSeen = msSinceLastUser / 1000 / 60;
        if (minutesSinceLastUserSeen >= triggerMinutes) { // inactivity threshold reached
            await exec('systemctl suspend');
        }
    } else {
        lastSeen = new Date(); // user was seen, mark the time
    }

    console.log({ lastSeen });
    setTimeout(main, checkMinutes * 60 * 1000);
}
main();
