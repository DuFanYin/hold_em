import socket
import threading
from player_table import *

socket_list = []
s = socket.socket()
s.bind(('127.0.0.1',9008))
s.listen()

def read_client(s):
    try:
        # recv from client
        return s.recv(2048).decode('utf-8')
    except:
        # delete from pool if fail to connect
        print(str(addr) + ' Left!')
        socket_list.remove(s)

def socket_target(s):
    global players
    s.send('type player name and buy-in, seperate by ,').encode('utf-8')
    player_name, buy_in = read_client(s).split(',')
    players.append(Player(player_name, buy_in))
    s.send('player added')

    try:
        while True:
            content = read_client(s)
            if content is None:
                break
            else:
                print(content)
            # 将一个客户端发送过来的数据广播给其他客户端
            for client in socket_list:
                client.send((str(addr)+ ' say: ' +content).encode('utf-8'))
    except:
        print('Error!')
        
num_players = int(input('how many number of players?'+'\n'))

player_id = 0
player_name_addr = {}     # map 
players = []

# accept all players
for i in range(num_players):
    conn, addr = s.accept()
    socket_list.append(conn)
    print(str(addr) + ' Joined!')
    # 每当有客户连接后，就启动一个线程为其服务
    threading.Thread(target=socket_target, args=(conn,)).start()


    



