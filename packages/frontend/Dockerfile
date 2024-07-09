FROM perl
WORKDIR /opt/evony_t_k_r_tips
COPY . .
RUN cpanm --installdeps -n .
EXPOSE 3000
CMD ./script/evony_tkrtips prefork
