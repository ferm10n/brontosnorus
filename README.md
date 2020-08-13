# brontosnorus
My first real Deno project. Puts my server to sleep if no one is SSHd in

## Why?

Energy bills man. I saw a simple problem and a direct way to overcomplicate a solution :wink:
Plus, I like the idea of using a js/ts runtime to do basic scripting tasks without the burden of adding node_modules and npming everywhere

## How?

Gets all running processes on an interval (5m default). Processes are filtered down to just active ssh processes that are not owned by root. If no users have logged in within the set period of time (15m default), the suspend command is called.

## Setup

- Install deno https://deno.land/manual/getting_started/installation
- Edit `brontosnorus.service` to have the correct paths for:
  - Your HOME directory, so deno can find its files
  - The deno binary
  - `main.ts` inside where you cloned this project
- Add and enable service `sudo cp bronbrontosnorus.service /etc/systemd/system/ && systemctl daemon-reload && systemctl start brontosnorus.service`

## Bonus! Wake on LAN

This allows me to wake the server remotely https://www.techrepublic.com/article/how-to-enable-wake-on-lan-in-ubuntu-server-18-04/

And this piece of SSH config allows me to trigger a WOL before sshing in!
```
Host <SERVER NAME>
    User <USERNAME>
    ForwardAgent yes
    ProxyCommand bash -c "wakeonlan -i 192.168.50.255 <MAC ADDRESS> && sleep 2s && nc -q0 <IP> <PORT> 2> /dev/null" 
```
Work smarter not harder :muscle::brain:
