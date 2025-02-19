# server side
#----------------------------------------------------------------------
import socket
import threading

socket_list = []
s = socket.socket()
s.bind(('10.3.98.118', 30000))
s.listen()

def read_client(s):
    try:
        # 接收客户端的数据
        return s.recv(2048).decode('utf-8')
    except:
        # 若有异常，说明连接失败，则删除该socket
        print(str(addr) + ' Left!')
        socket_list.remove(s)

def socket_target(s):
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
        

while True:
    conn, addr = s.accept()
    # 每当有客户连接后，就将其加到socket列表中
    socket_list.append(conn)
    print(str(addr) + ' Joined!')
    # 每当有客户连接后，就启动一个线程为其服务
    threading.Thread(target=socket_target, args=(conn,)).start()


# client side


import socket
import threading

s = socket.socket()
s.connect(('10.3.98.118', 30000))

def read_server(s):
    while True:
        # 子线程负责从服务端接受数据并打印
        content = s.recv(2048).decode('utf-8')
        print(content)
        
threading.Thread(target=read_server, args=(s,)).start()

while True:
    line = input('')
    if line == 'exit':
        break
    # 主线程负责将用户输入的数据发送到socket中
    s.send(line.encode('utf-8'))
#----------------------------------------------------------------------