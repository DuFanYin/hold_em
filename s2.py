import socket
from player_table import *

buf_size = 1024
s = socket.socket()
s.bind(('127.0.0.1',9009))
s.listen()

#设置client连接顺序部分
player_id = 0
j=0 #设置j为标志断开连接的指示变量
socket_pool = {}

num_of_players = int(input('number of players? '+ '\n'))

for i in range(num_of_players):
    c,address = s.accept()  #阻塞式等待client端的链接
    player_id += 1
    msg0 = str(player_id)
    c.send(msg0.encode('utf-8'))   # send client its number
    print("received client connection from {}, client number is {}".format(address,player_id))
    socket_pool[str(player_id)] = c

    player_number = player_id

close_server = False
print("Game ON!   Number of players: "+str(player_number))
while close_server != True:
    for i in range(player_number):
        player_talking_to = socket_pool[str(i+1)]
        msg = str(i+1)  # the client talking to
        player_talking_to.send(msg.encode('utf-8'))

        action_name = player_talking_to.recv(buf_size)

        if(action_name=='close'):
            close_server = True
        else:
            print('player choose action: {}'.format(action_name.decode('utf-8')))

                
s.close() #关闭监听主socket，服务端程序结束
print("连接已断开！")


